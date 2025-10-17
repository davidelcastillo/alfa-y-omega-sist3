// src/server/ventas.service.ts
import { prisma } from "@/lib/prisma";
import type { FiltersState, Order, Warehouse, VentaDetail } from "@/lib/ventas/types";

// Nota: La función getInitialVentasData puede que ya no sea necesaria
// si cargas los datos por separado en tu frontend. La incluyo por completitud.
export async function getInitialVentasData(): Promise<{
  orders: Order[];
  warehouses: Warehouse[];
}> {
  // Ambas llamadas se ejecutan en paralelo para mayor eficiencia
  const [orders, warehouses] = await Promise.all([
    listOrders(), // Llama a la nueva función que consulta la DB
    listWarehouses(), // Llama a la nueva función que consulta la DB
  ]);
  return { orders, warehouses };
}

{/*
export async function listOrders(filters?: FiltersState): Promise<Order[]> {
  // Construimos la cláusula 'where' de Prisma dinámicamente a partir de los filtros
  const whereClause: any = {};

  if (filters) {
    if (filters.from) {
      whereClause.fechaPedido = { ...whereClause.fechaPedido, gte: new Date(filters.from) };
    }
    if (filters.to) {
      whereClause.fechaPedido = { ...whereClause.fechaPedido, lte: new Date(filters.to) };
    }
    // Asumimos que 'orderNumber' es un campo en tu modelo Pedido.
    // Si no lo es, deberás ajustar esta parte (ej: filtrar por el ID).
    // Si no tienes un campo 'orderNumber', puedes comentar o eliminar las siguientes líneas.
    if (filters.orderNumber) {
       // Para este ejemplo, filtraremos por el ID del pedido.
       // Lo ideal sería que tuvieras un campo `numeroOrden` de tipo String.
      const orderId = parseInt(filters.orderNumber, 10);
      if (!isNaN(orderId)) {
        whereClause.id = orderId;
      }
    }
    // Filtro por el nombre del estado en la tabla relacionada EstadoPedido
    if (filters.status && (filters.status === "Enviado" || filters.status === "Pendiente de enviar")) {
      whereClause.estado = {
        nombre: filters.status,
      };
    }
  }

  const pedidos = await prisma.pedido.findMany({
    where: whereClause,
    include: {
      items: {
        include: {
          producto: true,
        },
      },
      envio: true,
      pagos: true,
      direccionEnvio: true,
      estado: true,
      metodoEnvio: true,
      usuario: {
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
        },
      },
    },
    orderBy: {
      fechaPedido: 'desc',
    },
  });

  // El siguiente paso es CRUCIAL: Mapear el resultado de Prisma a tu tipo `Order`.
  // Prisma devuelve objetos con tipos generados, pero tu frontend espera el tipo `Order`.
  return pedidos.map((pedido): Order => ({
    id: pedido.id.toString(),
    orderNumber: pedido.id.toString(), // Usamos el ID como orderNumber
    orderDate: pedido.fechaPedido.toISOString().split('T')[0], // Formato YYYY-MM-DD
    orderTime: pedido.fechaPedido.toISOString().split('T')[1].substring(0, 8), // Formato HH:mm:ss
    customerName: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`,
    totalProducts: pedido.items.reduce((sum, item) => sum + item.cantidad, 0),
    cardNumber: '**** **** **** ' + Math.floor(Math.random() * 9000 + 1000), // Dato de ejemplo, ajústalo a tu modelo real
    total: pedido.total,
    status: pedido.estado.nombre as "Enviado" | "Pendiente de enviar",
    shippedDate: pedido.envio?.fechaDespacho?.toISOString().split('T')[0],
    products: pedido.items.map(item => ({
      id: item.producto.id.toString(),
      name: item.producto.nombre,
      quantity: item.cantidad,
      unitPrice: item.precioUnitarioAlComprar,
      subtotal: item.cantidad * item.precioUnitarioAlComprar,
    })),
    history: [], // Deberás implementar la lógica para obtener el historial
    warehouse: pedido.envio ? 'Almacén Principal' : undefined, // Lógica de ejemplo
  }));
}
CAMBIO HECHO POR LUIS, ABAJO SE AGREGA LA MODIFICACION, BORRAR SI ROMPE, ES PARA EL DETALLE DEL PEDIDO*/}
export async function listOrders(filters?: FiltersState): Promise<Order[]> {
  const where: any = {};

  if (filters?.from || filters?.to) {
    where.fechaPedido = {};
    if (filters.from) where.fechaPedido.gte = new Date(`${filters.from}T00:00:00`);
    if (filters.to) where.fechaPedido.lte = new Date(`${filters.to}T23:59:59`);
  }

  if (filters?.orderNumber) {
    const or: any[] = [];
    or.push({ numeroPedido: { equals: filters.orderNumber } });
    const num = Number(filters.orderNumber);
    if (!Number.isNaN(num)) or.push({ id: num });
    if (or.length > 0) where.OR = or;
  }

  if (filters?.status && (filters.status === "Enviado" || filters.status === "Pendiente de enviar")) {
    where.estado = { nombre: filters.status };
  }

  const pedidos = await prisma.pedido.findMany({
    where,
    include: {
      items: { include: { producto: true } },
      envio: true,
      pagos: true,
      direccionEnvio: true,
      estado: true,
      metodoEnvio: true,
      usuario: { select: { nombre: true, apellido: true } },
    },
    orderBy: { fechaPedido: "desc" },
  });

  return pedidos.map((p): Order => {
    const iso = p.fechaPedido.toISOString();
    const orderDate = iso.split("T")[0];
    const orderTime = iso.split("T")[1].substring(0, 8);
    const numeroPedido = (p as any)?.numeroPedido as string | null | undefined;

    return {
      id: String(p.id),
      orderNumber: numeroPedido ?? String(p.id),
      orderDate,
      orderTime,
      customerName: `${p.usuario?.nombre ?? ""} ${p.usuario?.apellido ?? ""}`.trim(),
      totalProducts: p.items.reduce((sum, it) => sum + it.cantidad, 0),
      cardNumber: "**** **** **** " + Math.floor(Math.random() * 9000 + 1000),
      total: p.total,
      status: (p.estado?.nombre ?? "Pendiente de enviar") as "Enviado" | "Pendiente de enviar",
      shippedDate: p.envio?.fechaDespacho ? p.envio.fechaDespacho.toISOString().split("T")[0] : undefined,
      products: p.items.map((it) => ({
        id: String(it.producto.id),
        name: it.producto.nombre,
        quantity: it.cantidad,
        unitPrice: it.precioUnitarioAlComprar,
        subtotal: it.cantidad * it.precioUnitarioAlComprar,
      })),
      history: [],
      warehouse: p.envio ? "Almacén Principal" : undefined,
    };
  });
}


// Esta función asume que tus 'Warehouses' corresponden a los 'Depositos' en Prisma.
export async function listWarehouses(): Promise<Warehouse[]> {
    const depositos = await prisma.deposito.findMany({
        include: {
            stock: { // Incluimos el stock para obtener los productos de cada depósito
                include: {
                    producto: true
                }
            }
        }
    });

    // Mapeamos el resultado de Prisma al tipo `Warehouse` que espera tu aplicación
    return depositos.map(deposito => ({
        id: deposito.id.toString(),
        name: deposito.nombre,
        products: deposito.stock.map(stockItem => ({
            id: stockItem.producto.id.toString(),
            name: stockItem.producto.nombre,
            stock: stockItem.stockActual,
            price: stockItem.producto.precioVenta ?? 0,
        }))
    }));
}

export async function getOrderDetail(id: string | number): Promise<VentaDetail | null> {
  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: {
      items: { include: { producto: true } }, // DetallePedido + Producto
      envio: true,                             // Envio (fechaDespacho, etc.)
      pagos: true,                             // si querés mostrar pagos en el detalle luego
      direccionEnvio: true,
      estado: true,                            // EstadoPedido (nombre)
      metodoEnvio: true,
      usuario: { select: { nombre: true, apellido: true } },
    },
  });

  if (!pedido) return null;

  // Fechas formateadas
  const iso = pedido.fechaPedido.toISOString();     // 2025-10-17T13:45:12.000Z
  const orderDate = iso.split("T")[0];              // YYYY-MM-DD
  const orderTime = iso.split("T")[1].substring(0, 8); // HH:mm:ss
  const registrationDate = `${orderDate} ${orderTime}`;

  // Estado -> union literal del front
  const status = (pedido.estado?.nombre ?? "Pendiente de enviar") as
    | "Enviado"
    | "Pendiente de enviar";

  // Shipped date si existe
  const shippedDate = pedido.envio?.fechaDespacho
    ? pedido.envio.fechaDespacho.toISOString().split("T")[0]
    : undefined;

  // Warehouse: si más adelante relacionás Envio->Deposito, mapealo aquí
  const warehouse = pedido.envio ? "Almacén Principal" : undefined;

  return {
    id: String(pedido.id),
    /*orderNumber: pedido.numeroPedido ?? String(pedido.id), // usa numeroPedido si está cargado*/
    orderNumber: (pedido as any)?.numeroPedido ?? String(pedido.id),
    registrationDate,
    orderDate,
    orderTime,
    customerName: `${pedido.usuario?.nombre ?? ""} ${pedido.usuario?.apellido ?? ""}`.trim(),
    cardNumber: "**** **** **** " + Math.floor(Math.random() * 9000 + 1000), // no hay tarjeta en el schema
    status,
    shippedDate,
    warehouse,
    total: pedido.total,
    products: pedido.items.map((it) => ({
      id: String(it.producto.id),
      name: it.producto.nombre,
      quantity: it.cantidad,
      unitPrice: it.precioUnitarioAlComprar,
      subtotal: it.cantidad * it.precioUnitarioAlComprar,
    })),
    // Si luego tenés una tabla de historial real, mapéala aquí.
    history: [
      { date: registrationDate, action: "Pedido creado", user: "Sistema" },
      ...(shippedDate
        ? [{
            date: `${shippedDate} ${orderTime}`,
            action: "Pedido enviado",
            user: "Logística",
          }]
        : []),
    ],
  };
}