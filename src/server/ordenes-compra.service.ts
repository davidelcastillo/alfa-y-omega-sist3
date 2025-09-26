import { PrismaClient } from "@/generated/prisma";
import type { PurchaseOrder } from "@/lib/compras/purchase";

const prisma = new PrismaClient();

interface GetOrdenesCompraParams {
  page?: number;           // Número de página para la paginación
  limit?: number;          // Cantidad de resultados por página
  estado?: boolean;        // Filtro: solo órdenes activas (true) o inactivas (false)
  proveedorId?: number;    // Filtro: por proveedor específico
  depositoId?: number;     // Filtro: por depósito específico
  fecha_desde?: string;    // Filtro: fecha mínima de creación
  fecha_hasta?: string;    // Filtro: fecha máxima de creación
  search?: string;         // Búsqueda por nroOC u observaciones
  sort?: "asc" | "desc";   // Ordenar resultados por fecha ascendente o descendente
}

export async function getOrdenesCompra(params: GetOrdenesCompraParams) {
  const {
    page = 1,
    limit = 10,
    estado,
    proveedorId,
    depositoId,
    fecha_desde,
    fecha_hasta,
    search,
    sort = "desc",
  } = params;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (estado !== undefined) where.estado = estado;
  if (proveedorId) where.proveedorId = proveedorId;
  if (depositoId) where.depositoId = depositoId;
  // Filtro por rango de fechas
  if (fecha_desde || fecha_hasta) {
    where.fecha = {};
    if (fecha_desde) where.fecha.gte = new Date(fecha_desde);
    if (fecha_hasta) where.fecha.lte = new Date(fecha_hasta);
  }
  if (search) {
    where.OR = [
      { nroOC: { contains: search, mode: "insensitive" } },
      { observaciones: { contains: search, mode: "insensitive" } },
    ];
  }

  // Ejecutar consultas en paralelo para obtener datos y total

  const [data, total] = await Promise.all([
    prisma.ordenCompra.findMany({
      skip,
      take: limit,
      where,
      orderBy: { fecha: sort },
      include: {
        proveedor: {
          select: { id: true, nombre: true, razonSocial: true },
        },
        comprobantes: {
          select: { id: true },

        },
      },
    }),
    prisma.ordenCompra.count({ where }),
  ]);

// ---- Lookup de nombres de depósito SIN relación Prisma ----CAMBIOS HECHOS POR LUIS, CUALQUIER CONSULTA A EL
  const depositoIds = Array.from(
    new Set(data.map(oc => oc.depositoId).filter((id): id is number => id != null))
  );
  let depMap = new Map<number, string>();
  if (depositoIds.length) {
    // Detecta el modelo correcto en tiempo de ejecución (evita errores de tipos)
    const prismaAny = prisma as any;
    const depositoModel =
      prismaAny.deposito ??
      prismaAny.depositos ??
      prismaAny.Deposito ??
      prismaAny.Depositos;
    if (depositoModel) {
      const rows = await depositoModel.findMany({
        where: { id: { in: depositoIds } },
        select: { id: true, nombre: true }, // ⚠️ si tu campo es 'descripcion', cambialo aquí y abajo
      });
      depMap = new Map(rows.map((r: { id: number; nombre: string }) => [r.id, r.nombre]));
    }
  }
//-----

  return {
    data: data.map((oc) => ({
      id: oc.id,
      proveedorId: oc.proveedorId,                    // <--- Si rompe algo borrar
      proveedor: oc.proveedor?.nombre || oc.proveedor?.razonSocial,
      depositoId: oc.depositoId,
      depositoNombre: oc.depositoId != null ? (depMap.get(oc.depositoId) ?? null) : null, //agregado
      estado: oc.estado,
      total: oc.total,
      fecha_creacion: oc.fecha,
      usuario_creador: "pendiente", // si más adelante agregás usuario
    })),
    meta: {
      total,  // cantidad total de registros encontrados
      page,   // página actual
      limit,  // límite de registros por página
    },
  };
}


//De aqui para abajo puesto por LUIS para poder ver proveedores y deposito

export async function listProveedoresBasic() {
  const rows = await prisma.proveedores.findMany({
    where: { estado: true }, // solo activos; quitalo si querés todos
    select: { id: true, nombre: true, nombreComercial: true, razonSocial: true, codigo: true },
    orderBy: { nombre: "asc" },
    take: 500, // tope sano; ajustá si hace falta
  });

  // Devuelve shape compatible con tu UI (Supplier-like)
  return rows.map(r => ({
    id: String(r.id),
    name: r.nombre ?? r.nombreComercial ?? r.razonSocial ?? `Proveedor ${r.id}`,
    code: r.codigo ?? "", // tu tipo Supplier exige 'code'
  }));
}

export async function listDepositosBasic() {
  const rows = await prisma.deposito.findMany({
    where: { estado: true }, // idem activos
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
    take: 500,
  });

  // Devolvemos { id, name } para que sea fácil mapear a string[] si querés
  return rows.map(r => ({
    id: String(r.id),
    name: r.nombre,
  }));
}


function fmt(d?: Date | null) {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}


export async function getOrdenCompraDetalleUI(id: number): Promise<PurchaseOrder | null> {
  const oc = await prisma.ordenCompra.findUnique({
    where: { id },
    select: {
      id: true, fecha: true, hora: true, proveedorId: true, depositoId: true,
      subTotal: true, otrosGastos: true, total: true, fechaEntrega: true,
      estado: true, observaciones: true,
      proveedor: { select: { id: true, nombre: true, razonSocial: true, codigo: true } },
      detalleOrdenCompra: {
        select: {
          id: true, productoId: true, cantidad: true, precioUnitario: true,
          producto: { select: { id: true, nombre: true } },
        },
      },
    },
  });
  if (!oc) return null;

  let depositoNombre: string | null = null;
  if (oc.depositoId != null) {
    const dep = await prisma.deposito.findUnique({ where: { id: oc.depositoId }, select: { nombre: true } });
    depositoNombre = dep?.nombre ?? null;
  }

  const items = oc.detalleOrdenCompra.map((r) => ({
    id: String(r.id),
    productId: String(r.productoId),
    productName: r.producto?.nombre ?? "",
    quantity: Number(r.cantidad ?? 0),
    unitPrice: Number(r.precioUnitario ?? 0),
    totalPrice: Number((r.cantidad ?? 0) * (r.precioUnitario ?? 0)),
  }));

  return {
    id: String(oc.id),
    creationDate: fmt(oc.fecha),
    creationTime: oc.hora ?? "",
    supplier: {
      id: String(oc.proveedorId),
      name: oc.proveedor?.nombre ?? oc.proveedor?.razonSocial ?? "",
      code: oc.proveedor?.codigo ?? "",
    },
    warehouse: depositoNombre ?? (oc.depositoId != null ? String(oc.depositoId) : "—"),
    deliveryDate: fmt(oc.fechaEntrega),
    status: oc.estado ? "Completa" : "Incompleta",
    total: Number(oc.total ?? 0),
    totalQuantity: items.reduce((s, it) => s + it.quantity, 0),
    items,
  };
}
