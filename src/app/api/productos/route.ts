import { NextResponse } from 'next/server';
import { createProducto } from '@/server/productos.service';
import { createProductoSchema } from './schema';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = createProductoSchema.parse(json); // valida DTO

    const nuevo = await createProducto(data);

    return NextResponse.json(
      { ok: true, data: nuevo },
      { status: 201 }
    );
  } catch (err: unknown) {
    // Manejo de errores y status codes
    const msg = err instanceof Error ? err.message : 'Error interno';

    if (typeof msg === 'string' && msg.includes('no existe')) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: err.errors }, { status: 422 });
    }
    console.error('[POST /api/productos]', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
