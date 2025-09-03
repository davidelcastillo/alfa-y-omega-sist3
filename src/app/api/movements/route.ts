import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { createMovimiento } from '@/server/movimientos.service';

// Schemas con coerción para aceptar números como strings desde el cliente
const detalleSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive(),
});

const createSchema = z.object({
  depositoId: z.coerce.number().int().positive(),
  tipoMovimientoId: z.coerce.number().int().positive(),
  tipoComprobanteId: z.coerce.number().int().positive(),
  detalles: z.array(detalleSchema).min(1, 'Debe incluir al menos un detalle'),
});

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
