// src/app/api/stock/recalcular/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { recalcStock } from '@/server/calculador-stock.service';

const querySchema = z.object({
  depositoId: z.coerce.number().int().positive().optional(),
  productoId: z.coerce.number().int().positive().optional(),
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = querySchema.parse(
      Object.fromEntries(url.searchParams.entries())
    );

    const result = await recalcStock(parsed);
    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ ok: false, error: err.errors }, { status: 422 });
    }
    console.error('[POST /api/stock/recalcular]', err);
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}
