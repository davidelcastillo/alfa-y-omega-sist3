// src/app/api/dashboard/movimientos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/** ─────────── Validación de query ─────────── */
const QuerySchema = z.object({
  start: z.string().datetime().optional(), // ISO: 2025-09-09T00:00:00.000Z
  end: z.string().datetime().optional(),
  depositoId: z.coerce.number().int().positive().optional(),
  tipoMovimientoId: z.coerce.number().int().positive().optional(),
  rubroId: z.coerce.number().int().positive().optional(),
  productoId: z.coerce.number().int().positive().optional(),
});

type Query = z.infer<typeof QuerySchema>;

/** ─────────── Caché simple en memoria ─────────── */
const DEFAULT_TTL_MS = 60_000;
let cache:
  | { key: string; expires: number; payload: any }
  | null = null;

function cacheKey(q: Query) {
  return JSON.stringify(q);
}

/** ─────────── Helper de rango por defecto ─────────── */
function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30); // últimos 30 días
  return { start, end };
}

/** 
 * NOTA DE DISEÑO:
 * Hacemos todas las agregaciones en una sola consulta por bloque (totales, por tipo, por depósito, top5, serie diaria)
 * usando CTEs en PostgreSQL para minimizar roundtrips y mover el trabajo al motor SQL (más eficiente).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.parse({
      start: searchParams.get('start') ?? undefined,
      end: searchParams.get('end') ?? undefined,
      depositoId: searchParams.get('depositoId') ?? undefined,
      tipoMovimientoId: searchParams.get('tipoMovimientoId') ?? undefined,
      rubroId: searchParams.get('rubroId') ?? undefined,
      productoId: searchParams.get('productoId') ?? undefined,
    });

    const { start: _start, end: _end } = parsed.start && parsed.end
      ? { start: new Date(parsed.start), end: new Date(parsed.end) }
      : defaultRange();

    // Normalizamos límites (end exclusivo por consistencia)
    const start = new Date(_start);
    const end = new Date(_end);

    // Chequeo caché
    const key = cacheKey({ ...parsed, start: start.toISOString(), end: end.toISOString() } as any);
    if (cache && cache.key === key && cache.expires > Date.now()) {
      return NextResponse.json(cache.payload);
    }

    /** Parámetros comunes para el SQL */
    const params = {
      start,
      end,
      depositoId: parsed.depositoId ?? null,
      tipoMovimientoId: parsed.tipoMovimientoId ?? null,
      rubroId: parsed.rubroId ?? null,
      productoId: parsed.productoId ?? null,
    };

    /**
     * SQL PRINCIPAL (CTEs):
     * - base: une movimientos + tipos + detalles + stock + producto + rubro (solo columnas necesarias)
     * - totales: ingresos/egresos/neto + conteo de movimientos
     * - por_tipo: agregación por tipoMovimiento (id, nombre, ingresoEgreso)
     * - por_deposito: agregación por depósito
     * - top_productos: top 5 por unidades movidas absolutas
     * - serie_diaria: sumas por día separando ingresos/egresos
     */
    const rows = await prisma.$queryRawUnsafe<any[]>(`
WITH base AS (
  SELECT
    ms.id                 AS movimiento_id,
    ms.fecha              AS fecha,
    ms."depositoId"       AS deposito_id,
    d.nombre              AS deposito_nombre,
    tm.id                 AS tipo_id,
    tm.nombre             AS tipo_nombre,
    tm."ingresoEgreso"    AS es_ingreso,
    dm.cantidad           AS cantidad,
    s."productoId"        AS producto_id,
    p.nombre              AS producto_nombre,
    p."rubroId"           AS rubro_id,
    r.nombre              AS rubro_nombre
  FROM "MovimientoStock" ms
  JOIN "TipoMovimiento" tm ON tm.id = ms."tipoMovimientoId"
  JOIN "DetalleMovimiento" dm ON dm."movimientoId" = ms.id
  JOIN "StockPorDeposito" s ON s.id = dm."stockId"
  JOIN "Producto" p ON p.id = s."productoId"
  JOIN "Rubro" r ON r.id = p."rubroId"
  JOIN "Deposito" d ON d.id = ms."depositoId"
  WHERE ms.fecha >= $1
    AND ms.fecha <  $2
    AND ($3::int IS NULL OR ms."depositoId" = $3)
    AND ($4::int IS NULL OR tm.id = $4)
    AND ($5::int IS NULL OR p."rubroId" = $5)
    AND ($6::int IS NULL OR p.id = $6)
),
totales AS (
  SELECT
    COALESCE(SUM(CASE WHEN es_ingreso THEN cantidad END), 0) AS ingresos_unidades,
    COALESCE(SUM(CASE WHEN NOT es_ingreso THEN cantidad END), 0) AS egresos_unidades,
    COUNT(DISTINCT movimiento_id) AS movimientos_count
  FROM base
),
por_tipo AS (
  SELECT
    tipo_id,
    tipo_nombre,
    bool_or(es_ingreso) AS es_ingreso,
    SUM(cantidad) AS unidades
  FROM base
  GROUP BY tipo_id, tipo_nombre
),
por_deposito AS (
  SELECT
    deposito_id,
    deposito_nombre,
    SUM(CASE WHEN es_ingreso THEN cantidad ELSE 0 END) AS ingresos,
    SUM(CASE WHEN NOT es_ingreso THEN cantidad ELSE 0 END) AS egresos
  FROM base
  GROUP BY deposito_id, deposito_nombre
),
top_productos AS (
  SELECT
    producto_id,
    producto_nombre,
    SUM(cantidad)                              AS unidades_totales,
    SUM(CASE WHEN es_ingreso THEN cantidad END) AS ingresos,
    SUM(CASE WHEN NOT es_ingreso THEN cantidad END) AS egresos
  FROM base
  GROUP BY producto_id, producto_nombre
  ORDER BY ABS(SUM(cantidad)) DESC, producto_nombre
  LIMIT 5
),
serie_diaria AS (
  SELECT
    DATE_TRUNC('day', fecha)::date AS dia,
    SUM(CASE WHEN es_ingreso THEN cantidad ELSE 0 END) AS ingresos,
    SUM(CASE WHEN NOT es_ingreso THEN cantidad ELSE 0 END) AS egresos
  FROM base
  GROUP BY DATE_TRUNC('day', fecha)
  ORDER BY dia
)
SELECT
  (SELECT row_to_json(t) FROM (
     SELECT
       ingresos_unidades,
       egresos_unidades,
       (ingresos_unidades - egresos_unidades) AS neto_unidades,
       movimientos_count
     FROM totales
   ) t) AS totales,
  (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
     SELECT tipo_id, tipo_nombre, es_ingreso, unidades
     FROM por_tipo
     ORDER BY es_ingreso DESC, unidades DESC
   ) t) AS por_tipo,
  (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
     SELECT deposito_id, deposito_nombre, ingresos, egresos, (ingresos - egresos) AS neto
     FROM por_deposito
     ORDER BY deposito_nombre
   ) t) AS por_deposito,
  (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
     SELECT producto_id, producto_nombre, unidades_totales, ingresos, egresos
     FROM top_productos
   ) t) AS top_productos,
  (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
     SELECT dia, ingresos, egresos, (ingresos - egresos) AS neto
     FROM serie_diaria
   ) t) AS serie_diaria
;
    `, params.start, params.end, params.depositoId, params.tipoMovimientoId, params.rubroId, params.productoId);

    // rows[0] contiene todo empaquetado por los SELECTs finales
    const payload = {
      updatedAt: new Date().toISOString(),
      range: { start: start.toISOString(), end: end.toISOString() },
      ...rows[0],
    };

    // Guardamos en caché
    cache = {
      key,
      expires: Date.now() + DEFAULT_TTL_MS,
      payload,
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error('GET /api/dashboard/movimientos error:', err);
    return NextResponse.json(
      { error: 'Error al calcular indicadores de movimientos', details: err?.message },
      { status: 500 }
    );
  }
}
