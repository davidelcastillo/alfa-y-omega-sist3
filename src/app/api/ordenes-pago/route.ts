// src/app/api/ordenes-pago/route.ts
// ordenes de pago - listado con filtros, paginación y totales
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// helpers para parseo de query params
const toInt = (v: string | null, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const parseDate = (v: string | null) => (v ? new Date(v) : null);
const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const parseSort = (raw: string | null) => {
  const s = (raw || "").trim();
  const dir = s.startsWith("-") ? "desc" : "asc";
  const key = s.replace(/^-/, "") || "fecha";
  switch (key) {
    case "fecha":
      return [{ fecha: dir as "asc" | "desc" }, { id: "desc" as const }];
    case "total":
      return [{ totalPagado: dir as "asc" | "desc" }, { id: "desc" as const }];
    case "proveedor":
      return [
        { Proveedores: { nombre: dir as "asc" | "desc" } },
        { id: "desc" as const },
      ];
    case "metodoPago":
      return [
        { MetodoPago: { nombre: dir as "asc" | "desc" } },
        { id: "desc" as const },
      ];
    case "estado":
      return [{ estado: dir as "asc" | "desc" }, { fecha: "desc" as const }];
    default:
      return [{ fecha: "desc" as const }, { id: "desc" as const }];
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // paginación
    const page = Math.max(toInt(searchParams.get("page"), 1), 1);
    const limit = Math.min(
      Math.max(toInt(searchParams.get("limit"), 20), 1),
      100
    );
    const skip = (page - 1) * limit;

    // filtros
    const proveedorId = searchParams.get("proveedorId");
    const metodoPagoId = searchParams.get("metodoPagoId");
    const estadoParam = searchParams.get("estado"); // true/false
    const fechaDesde = parseDate(searchParams.get("fecha_desde"));
    const fechaHasta = parseDate(searchParams.get("fecha_hasta"));
    const search = searchParams.get("search"); // nroInterno o nombre proveedor
    const sort = searchParams.get("sort"); // -fecha, total, -total, proveedor, -proveedor, etc.

    const where: any = {};
    if (proveedorId) where.proveedorId = Number(proveedorId);
    if (metodoPagoId) where.metodoPagoId = Number(metodoPagoId);
    if (estadoParam === "true" || estadoParam === "false")
      where.estado = estadoParam === "true";
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) where.fecha.gte = fechaDesde;
      if (fechaHasta) where.fecha.lte = endOfDay(fechaHasta);
    }

    const or: any[] = [];
    if (search && search.trim()) {
      const q = search.trim();
      or.push(
        { nroInterno: { contains: q, mode: "insensitive" } },
        { Proveedores: { nombre: { contains: q, mode: "insensitive" } } }
      );
    }
    if (or.length) where.OR = or;

    // total + agregados (para meta)
    const [total, agg, rows] = await Promise.all([
      prisma.ordenPago.count({ where }),
      prisma.ordenPago.aggregate({
        where,
        _sum: { totalPagado: true },
      }),
      prisma.ordenPago.findMany({
        where,
        orderBy: parseSort(sort),
        skip,
        take: limit,
        select: {
          id: true,
          fecha: true,
          nroInterno: true,
          estado: true,
          totalPagado: true,
          MetodoPago: { select: { id: true, nombre: true } },
          Proveedores: { select: { id: true, nombre: true } },
          DetalleOrdenPago: {
            select: {
              montoPagado: true,
              saldoPrevio: true,
              saldoRestante: true,
            },
          },
        },
      }),
    ]);

    const items = rows.map((op) => {
      const detalles = op.DetalleOrdenPago;
      const totalDetalle = detalles.reduce(
        (a, d) => a + Number(d.montoPagado ?? 0),
        0
      );
      const totalPagado = Number(op.totalPagado ?? totalDetalle);

      const saldoRestanteTotal = detalles
        .map((d) => Number(d.saldoRestante ?? 0))
        .reduce((a, b) => a + b, 0);

      // estado de pago:
      // - anulada -> 'anulada'
      // - sin detalles -> 'sin_detalle'
      // - todos saldoRestante = 0 -> 'completo'
      // - otro caso -> 'parcial'
      let estado_pago: "anulada" | "sin_detalle" | "completo" | "parcial" =
        "parcial";
      if (!op.estado) estado_pago = "anulada";
      else if (detalles.length === 0) estado_pago = "sin_detalle";
      else if (detalles.every((d) => Number(d.saldoRestante ?? 0) === 0))
        estado_pago = "completo";

      return {
        id: op.id,
        fecha: op.fecha,
        nro_interno: op.nroInterno,
        proveedor: { id: op.Proveedores.id, nombre: op.Proveedores.nombre },
        metodo_pago: op.MetodoPago
          ? { id: op.MetodoPago.id, nombre: op.MetodoPago.nombre }
          : null,
        estado: op.estado,
        estado_pago,
        total_pagado: totalPagado,
        comprobantes_afectados: detalles.length,
        saldo_restante_total: saldoRestanteTotal,
      };
    });

    return NextResponse.json({
      meta: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
        totales: {
          total_pagado: Number(agg._sum.totalPagado ?? 0), // agregado del conjunto filtrado
        },
      },
      items,
    });
  } catch (err: any) {
    console.error("GET /api/ordenes-pago", err);
    return NextResponse.json(
      { error: "Error al listar órdenes de pago", details: err?.message },
      { status: 500 }
    );
  }
}
