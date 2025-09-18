// src/app/api/movimientos/route.ts
import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { createMovimiento } from '@/server/movimientos.service';

// Runtime Node
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// --------- VALIDACIONES (Zod) ----------
const detalleSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive(),
});

const createSchema = z.object({
  depositoId: z.coerce.number().int().positive(),
  tipoMovimientoId: z.coerce.number().int().positive(),
  tipoComprobanteId: z.coerce.number().int().positive(),
  numeroComprobante: z.string().min(1).optional(),
  comentario: z.string().optional(), // <- coincide con el schema
  detalles: z.array(detalleSchema).min(1, 'Debe incluir al menos un detalle'),
});

// --------- POST: Crear movimiento ----------
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = createSchema.parse(json);
    const movimiento = await createMovimiento(data);
    return NextResponse.json({ ok: true, data: movimiento }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: 'VALIDATION_ERROR', issues: err.issues },
        { status: 422 },
      );
    }
    const msg = (err as Error)?.message ?? 'Internal Error';
    if (/(no existe|inactivo|insuficiente|vac[ií]os|inexistente|inv[aá]lid)/i.test(msg)) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// --------- GET: Listado con filtros + paginación (keyset) ----------
type Boolish = string | null;
const toBool = (v: Boolish) => v === '1' || v === 'true';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Filtros
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const depositoId = searchParams.get('depositoId');
    const tipoMovimientoId = searchParams.get('tipoMovimientoId');
    const tipoComprobanteId = searchParams.get('tipoComprobanteId');
    const rubroId = searchParams.get('rubroId');
    const marcaId = searchParams.get('marcaId');
    const unidadId = searchParams.get('unidadId');
    const productoId = searchParams.get('productoId');
    const q = searchParams.get('q');
    const minCantidad = searchParams.get('minCantidad');
    const maxCantidad = searchParams.get('maxCantidad');
    const esIngreso = searchParams.get('esIngreso'); // mapea a tm.saldo

    // Orden/paginación
    const orderBy = (searchParams.get('orderBy') || 'fecha').toLowerCase(); // 'fecha' | 'detalle_id'
    const dir = (searchParams.get('dir') || 'desc').toLowerCase(); // 'asc' | 'desc'
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50', 10), 500);
    const cursor = searchParams.get('cursor');

    // Rango default: últimos 30 días
    const endDt = end ? new Date(end) : new Date();
    const startDt = start ? new Date(start) : new Date(endDt.getTime() - 30 * 24 * 60 * 60 * 1000);

    const orderDir = dir === 'asc' ? 'ASC' : 'DESC';
    const orderSql =
      orderBy === 'detalle_id'
        ? `ORDER BY dm.id ${orderDir}`
        : `ORDER BY ms.fecha ${orderDir}, dm.id ${orderDir}`;

    // WHERE dinámico
    const where: string[] = [`ms.fecha >= $1`, `ms.fecha <  $2`];
    const params: any[] = [startDt, endDt];

    const add = (cond: string, val: any) => {
      params.push(val);
      where.push(cond.replace(/\$\(\?\)/g, `$${params.length}`));
    };

    if (depositoId) add(`ms."depositoId" = $(?)`, Number(depositoId));
    if (tipoMovimientoId) add(`ms."tipoMovimientoId" = $(?)`, Number(tipoMovimientoId));
    if (tipoComprobanteId) add(`ms."tipoComprobanteId" = $(?)`, Number(tipoComprobanteId));
    if (rubroId) add(`p."rubroId" = $(?)`, Number(rubroId));
    if (marcaId) add(`p."marcaId" = $(?)`, Number(marcaId));
    if (unidadId) add(`p."unidadId" = $(?)`, Number(unidadId));
    if (productoId) add(`p.id = $(?)`, Number(productoId));
    if (minCantidad) add(`dm.cantidad >= $(?)`, Number(minCantidad));
    if (maxCantidad) add(`dm.cantidad <= $(?)`, Number(maxCantidad));
    if (esIngreso !== null) add(`tm."saldo" = $(?)`, toBool(esIngreso));

    if (q) {
      const like = `%${q}%`;
      const base = params.length + 1;
      where.push(`(
        p.nombre  ILIKE $${base} OR
        r.nombre  ILIKE $${base + 1} OR
        d.nombre  ILIKE $${base + 2} OR
        tc.nombre ILIKE $${base + 3} OR
        tm.nombre ILIKE $${base + 4}
      )`);
      params.push(like, like, like, like, like);
    }

    if (cursor) {
      add(`dm.id ${orderDir === 'ASC' ? '>' : '<'} $(?)`, Number(cursor));
    }

    const limit = pageSize + 1;
    params.push(limit);
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT
        ms.id                       AS mov_id,               --por si se necesita
        dm.id                       AS detalle_id,
        ms.fecha                    AS fecha,
        ms."numeroComprobante"      AS "numeroComprobante",
        ms."Comentario"             AS "comentario",
        d.nombre                    AS deposito,
        tm.nombre                   AS tipo_movimiento,
        tm."saldo"                  AS es_ingreso,
        tc.nombre                   AS tipo_comprobante,
        p.nombre                    AS producto,
        r.nombre                    AS rubro,
        u.nombre                    AS unidad,
        m.nombre                    AS marca,
        dm.cantidad                 AS cantidad
      FROM "DetalleMovimiento" dm
      JOIN "MovimientoStock" ms   ON ms.id = dm."movimientoId"
      JOIN "StockPorDeposito" s   ON s."productoId" = dm."productoId" AND s."depositoId" = ms."depositoId"
      JOIN "Producto" p           ON p.id  = s."productoId"
      JOIN "Rubro" r              ON r.id  = p."rubroId"
      JOIN "Unidad" u             ON u.id  = p."unidadId"
      JOIN "Marca"  m             ON m.id  = p."marcaId"
      JOIN "Deposito" d           ON d.id  = ms."depositoId"
      JOIN "TipoMovimiento" tm    ON tm.id = ms."tipoMovimientoId"
      JOIN "TipoComprobante" tc   ON tc.id = ms."tipoComprobanteId"
      ${whereSql}
      ${orderSql}
      LIMIT $${params.length}
    `;

    const rows = await prisma.$queryRawUnsafe<any[]>(sql, ...params);

    const hasMore = rows.length > pageSize;
    const data = hasMore ? rows.slice(0, pageSize) : rows;
    const nextCursor = hasMore ? String(data[data.length - 1].detalle_id) : null;

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      range: { start: startDt.toISOString(), end: endDt.toISOString() },
      pageSize,
      orderBy: orderBy === 'detalle_id' ? 'detalle_id' : 'fecha',
      dir: orderDir.toLowerCase(),
      hasMore,
      nextCursor,
      items: data,
    });
  } catch (err: any) {
    console.error('GET /api/movimientos error', err);
    return NextResponse.json(
      { error: 'Error al filtrar movimientos', details: err?.message },
      { status: 500 },
    );
  }
}
