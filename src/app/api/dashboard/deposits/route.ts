import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory cache with TTL
const CACHE_TTL_MS = 60 * 1000; // 1 minute

interface Metrics {
  totalDepositos: number;
  activos: number;
  inactivos: number;
  capacidadTotal: number;
  capacidadPromedio: number;
  totalStock: number;
  porTipo: { tipo: string; cantidad: number }[];
}

interface CacheEntry {
  data: { ok: true; metrics: Metrics };
  expires: number;
}

let cache: CacheEntry | null = null;

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.data);
  }

  try {
    const [statusCounts, tipoCounts, capacityAgg, stockAgg] = await prisma.$transaction([
      prisma.deposito.groupBy({
        by: ["estado"],
        _count: { _all: true },
      }),
      prisma.deposito.groupBy({
        by: ["tipo"],
        _count: { _all: true },
      }),
      prisma.deposito.aggregate({
        _sum: { capacidad: true },
        _avg: { capacidad: true },
      }),
      prisma.stockPorDeposito.aggregate({
        _sum: { stockActual: true },
      }),
    ]);

    const totalDepositos = statusCounts.reduce(
      (acc, s) => acc + s._count._all,
      0
    );
    const activos =
      statusCounts.find((s) => s.estado === true)?._count._all ?? 0;
    const inactivos =
      statusCounts.find((s) => s.estado === false)?._count._all ?? 0;

    const response: CacheEntry["data"] = {
      ok: true,
      metrics: {
        totalDepositos,
        activos,
        inactivos,
        capacidadTotal: capacityAgg._sum.capacidad ?? 0,
        capacidadPromedio: capacityAgg._avg.capacidad ?? 0,
        totalStock: stockAgg._sum.stockActual ?? 0,
        porTipo: tipoCounts.map((t) => ({
          tipo: t.tipo,
          cantidad: t._count._all,
        })),
      },
    };

    cache = { data: response, expires: now + CACHE_TTL_MS };
    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Error interno",
      },
      { status: 500 }
    );
  }
}

