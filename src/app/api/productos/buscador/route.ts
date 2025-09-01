import { NextResponse } from 'next/server';
import { buscarProductos } from '@/server/productos.service';

const toInt = (v: string | null) => (v === null || v === '' ? undefined : Number(v));
const toBool = (v: string | null) =>
  v === null ? undefined : v === 'true' ? true : v === 'false' ? false : undefined;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q        = searchParams.get('q') ?? undefined;
    const marcaId  = toInt(searchParams.get('marcaId'));
    const rubroId  = toInt(searchParams.get('rubroId'));
    const unidadId = toInt(searchParams.get('unidadId'));
    const estado   = toBool(searchParams.get('estado'));

    const sort  = (searchParams.get('sort') as any) || 'nombre';
    const order = (searchParams.get('order') as any) || 'asc';

    const take   = toInt(searchParams.get('take')) ?? 20;
    const cursor = toInt(searchParams.get('cursor'));

    const result = await buscarProductos({
      q, marcaId, rubroId, unidadId, estado, sort, order, take, cursor,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[GET /api/productos/buscador]', err);
    return NextResponse.json({ ok: false, error: 'Bad Request' }, { status: 400 });
  }
}
