// src/server/calculador-stock.service.ts
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma'; // lo importamos para tipos

export type StockStatus = 'ok' | 'belowMin' | 'atZero' | 'overMax';

// Resultado por fila de stock recalculado
type RowCalc = {
  stockId: number;
  productoId: number;
  depositoId: number;
  stockMinimo: number;
  stockMaximo: number | null;
  capacidadMaxima: number | null;
  nuevoStock: number;
  status: StockStatus;
  warnings: string[];
};

export type RecalcOptions = {
  depositoId?: number;
  productoId?: number;
};

function statusOf(nuevo: number, min: number, max: number | null): StockStatus {
  if (nuevo === 0) return 'atZero';
  if (max != null && nuevo > max) return 'overMax';
  if (nuevo < (min ?? 0)) return 'belowMin';
  return 'ok';
}

/**
 * Recalcula el stockActual a partir de los movimientos.
 */
export async function recalcStock(options: RecalcOptions) {
  const whereStock: Prisma.StockPorDepositoWhereInput = {};
  if (options.depositoId) whereStock.depositoId = options.depositoId;
  if (options.productoId) whereStock.productoId = options.productoId;

  // 1) Candidatos a recalcular
  const stocks = await prisma.stockPorDeposito.findMany({
    where: whereStock,
    select: {
      id: true,
      productoId: true,
      depositoId: true,
      stockMinimo: true,
      stockMaximo: true,
      capacidadMaxima: true,
    },
  });

  if (stocks.length === 0) {
    return {
      updated: 0,
      summary: { ok: 0, belowMin: 0, atZero: 0, overMax: 0 },
      items: [] as RowCalc[],
    };
  }

  const stockIds = stocks.map((s) => s.id);

  // 2) Traemos todos los detalles involucrados (con signo por tipo de movimiento)
  const detalles = await prisma.detalleMovimiento.findMany({
    where: { stockId: { in: stockIds } },
    select: {
      stockId: true,
      cantidad: true,
      movimiento: {
        select: { tipoMovimiento: { select: { ingresoEgreso: true } } },
      },
    },
  });

  // 3) Reducimos a saldo por stockId
  const saldoPorStock = new Map<number, number>();
  for (const d of detalles) {
    const sign = d.movimiento.tipoMovimiento.ingresoEgreso ? 1 : -1;
    const prev = saldoPorStock.get(d.stockId) ?? 0;
    saldoPorStock.set(d.stockId, prev + sign * d.cantidad);
  }

  // 4) Calculamos estado y preparamos updates
  const updates: ReturnType<typeof prisma.stockPorDeposito.update>[] = [];
  const items: RowCalc[] = [];

  for (const s of stocks) {
    const nuevo = saldoPorStock.get(s.id) ?? 0;
    const st = statusOf(nuevo, s.stockMinimo ?? 0, s.stockMaximo);
    const warnings: string[] = [];

    if (s.capacidadMaxima != null && nuevo > s.capacidadMaxima) {
      warnings.push(
        `Supera capacidadMaxima (${nuevo} > ${s.capacidadMaxima})`
      );
    }

    updates.push(
      prisma.stockPorDeposito.update({
        where: { id: s.id },
        data: { stockActual: nuevo },
      })
    );

    items.push({
      stockId: s.id,
      productoId: s.productoId,
      depositoId: s.depositoId,
      stockMinimo: s.stockMinimo ?? 0,
      stockMaximo: s.stockMaximo,
      capacidadMaxima: s.capacidadMaxima,
      nuevoStock: nuevo,
      status: st,
      warnings,
    });
  }

  // 5) Persistimos en una transacción
  await prisma.$transaction(updates);

  // 6) Resumen
  const summary = items.reduce(
    (acc, r) => {
      acc[r.status]++;
      return acc;
    },
    { ok: 0, belowMin: 0, atZero: 0, overMax: 0 }
  );

  return {
    updated: items.length,
    summary,
    items,
  };
}
