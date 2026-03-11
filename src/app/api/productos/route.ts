// src/app/api/productos/route.ts
import { NextResponse } from 'next/server';
import { createProducto } from '@/server/productos.service';
import { createProductoSchema } from './schema';
import { ZodError } from 'zod'; // hay que hacer npm i zod

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = createProductoSchema.parse(json);
    const nuevo = await createProducto(data);
    return NextResponse.json({ ok: true, data: nuevo }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: err.issues }, { status: 422 });
    }
    const msg = (err as Error)?.message ?? 'Internal Error';
    const status = /no existe/i.test(msg) ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
