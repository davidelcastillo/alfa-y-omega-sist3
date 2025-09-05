// src/app/api/dashboard/deposits/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Row = {
  depositoId: number;
  nombre: string;
  tipo: string;
  estado: boolean;
  skuCount: number;
  totalUnits: number;
  productsBelowMin: number;
  productsAtZero: number;
  productsOverMax: number;
  occupancyPercent: number | null;
  lastMovementAt: Date | null;
};

type Payload = {
  updatedAt: string;
  totals: {
    deposits: number;
    skuCount: number;
    totalUnits: number;
    productsBelowMin: number;
    productsAtZero: number;
    productsOverMax: number;
  };
  deposits: Row[];
};

// --- Caché simple en memoria (scope de módulo)
const DEFAULT_TTL_MS = 60_000;
let cache:
  | { expires: number; payload: Payload }
  | null = null;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ttl = Math.max(
    5_000,
    Math.min(5 * 60_000, Number(searchParams.get('ttl')) || DEFAULT_TTL_MS),
  );

  // HIT de caché
  const now = Date.now();
  if (cache && cache.expires > now) {
    const res = NextResponse.json({ ok: true, cached: true, data: cache.payload });
    res.headers.set('x-cache', 'HIT');
    return res;
  }

  try {
    // Consulta agregada por depósito (PostgreSQL)
    const rows = (await prisma.$queryRaw<Row[]>`
      SELECT
        d.id AS "depositoId",
        d.nombre,
        d.tipo,
        d.estado,
        COALESCE(COUNT(spd.id), 0)::int                    AS "skuCount",
        COALESCE(SUM(spd."stockActual"), 0)::int           AS "totalUnits",
        COALESCE(SUM(CASE WHEN spd."stockActual" <= spd."stockMinimo" THEN 1 ELSE 0 END), 0)::int
          AS "productsBelowMin",
        COALESCE(SUM(CASE WHEN spd."stockActual" = 0 THEN 1 ELSE 0 END), 0)::int
          AS "productsAtZero",
        COALESCE(SUM(CASE
            WHEN spd."stockMaximo" IS NOT NULL AND spd."stockActual" > spd."stockMaximo" THEN 1
            ELSE 0
        END), 0)::int AS "productsOverMax",
        CASE
          WHEN COALESCE(SUM(NULLIF(spd."stockMaximo", 0)), 0) > 0
            THEN ROUND(
              (SUM(spd."stockActual")::numeric / SUM(NULLIF(spd."stockMaximo", 0))::numeric) * 100
            , 2)
          ELSE NULL
        END AS "occupancyPercent",
        MAX(ms.fecha) AS "lastMovementAt"
      FROM "Deposito" d
      LEFT JOIN "StockPorDeposito" spd ON spd."depositoId" = d.id
      LEFT JOIN "MovimientoStock" ms ON ms."depositoId" = d.id
      GROUP BY d.id, d.nombre, d.tipo, d.estado
      ORDER BY d.nombre ASC;
    `) as Row[];

    // Totales globales
    const totals = rows.reduce(
      (acc, r) => {
        acc.deposits += 1;
        acc.skuCount += r.skuCount;
        acc.totalUnits += r.totalUnits;
        acc.productsBelowMin += r.productsBelowMin;
        acc.productsAtZero += r.productsAtZero;
        acc.productsOverMax += r.productsOverMax;
        return acc;
      },
      {
        deposits: 0,
        skuCount: 0,
        totalUnits: 0,
        productsBelowMin: 0,
        productsAtZero: 0,
        productsOverMax: 0,
      }
    );

    const payload: Payload = {
      updatedAt: new Date().toISOString(),
      totals,
      deposits: rows,
    };

    // Guardar en caché
    cache = { expires: now + ttl, payload };

    const res = NextResponse.json({ ok: true, cached: false, data: payload });
    res.headers.set('x-cache', 'MISS');
    res.headers.set('cache-ttl-ms', String(ttl));
    return res;
  } catch (err) {
    console.error('[GET /api/dashboard/deposits]', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
