// src/server/ordenes-compra.service.ts
import { prisma } from "@/lib/prisma";

type GetOCParams = {
  page: number;
  limit: number;
  estado?: boolean;
  proveedorId?: number;
  depositoId?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
  sort?: "asc" | "desc";
};

export async function getOrdenesCompra(params: GetOCParams) {
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

  const where: any = {};
  if (estado !== undefined) where.estado = estado;
  if (proveedorId) where.proveedorId = proveedorId;
  if (depositoId) where.depositoId = depositoId;
  if (fecha_desde || fecha_hasta) {
    where.fecha = {};
    if (fecha_desde) where.fecha.gte = new Date(fecha_desde);
    if (fecha_hasta) {
      const end = new Date(fecha_hasta);
      if (!fecha_hasta.includes("T")) end.setHours(23, 59, 59, 999);
      where.fecha.lte = end;
    }
  }
  if (search?.trim()) {
    where.OR = [
      { nroOC: { contains: search, mode: "insensitive" } },
      { observaciones: { contains: search, mode: "insensitive" } },
      { proveedor: { is: { nombre: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const [total, rowsRaw, depositos] = await Promise.all([
    prisma.ordenCompra.count({ where }),
    prisma.ordenCompra.findMany({
      where,
      orderBy: { fecha: sort },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        fecha: true,
        hora: true,
        nroOC: true,
        proveedor: { select: { id: true, nombre: true } }, // 👈 objeto
        depositoId: true,                                   // 🟢 mantenemos solo el ID (no hay relación en schema)
        subTotal: true,
        otrosGastos: true,
        total: true,
        estado: true,
        _count: { select: { detalleOrdenCompra: true } },   // 👈 presente
      },
    }),
    prisma.deposito.findMany({ select: { id: true, nombre: true } }), // 🟢 AGREGADO: traemos depósitos para mapear id→nombre
  ]);

  // 🟢 AGREGADO: mapa id → nombre de depósitos
  const depositoMap = new Map(depositos.map((d) => [d.id, d.nombre]));

  // Normalización de tipos para el front:
  const rows = rowsRaw.map((r) => ({
    ...r,
    fecha: r.fecha instanceof Date ? r.fecha.toISOString() : String(r.fecha), // 👈 string ISO
    warehouse: r.depositoId ? (depositoMap.get(r.depositoId) ?? "—") : "—",   // 🟢 AGREGADO: nombre del depósito listo para el front
  }));

  console.log("🟡 Orden de compra recibida de la BD:", JSON.stringify(rowsRaw[0], null, 2));

  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    data: rows,
  };
}
