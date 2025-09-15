import { PrismaClient } from "@/generated/prisma";

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

  return {
    data: data.map((oc) => ({
      id: oc.id,
      proveedor: oc.proveedor?.nombre || oc.proveedor?.razonSocial,
      depositoId: oc.depositoId,
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
