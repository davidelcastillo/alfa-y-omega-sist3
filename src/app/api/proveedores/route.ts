import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listarProveedores } from '@/server/proveedores.service';

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  cuit: z.string().optional(),
  cuil: z.string().optional(),
  razon_social: z.string().optional(),
  categoria_fiscal: z.string().optional(), // llega string, se castea a número en el servicio
  provincia: z.string().optional(),
  localidad: z.string().optional(),
  sort: z.string().optional(), // ej: "nombre:desc"
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const q = querySchema.parse(params);

    const result = await listarProveedores(q);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ ok: false, error: err.errors }, { status: 422 });
    }
    console.error('[GET /api/proveedores]', err);
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}
