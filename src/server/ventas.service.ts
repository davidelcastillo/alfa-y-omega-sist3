// src/server/ventas.service.ts
import { prisma } from "@/lib/prisma"; // Asegúrate que la ruta a tu cliente prisma sea correcta
import type { FiltersState, Order, Warehouse } from "@/lib/ventas/types";

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