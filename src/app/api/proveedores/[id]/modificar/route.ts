import { NextResponse } from 'next/server';
import { actualizarProveedor } from '@/server/proveedores.service';
import { updateProveedorSchema } from '../../schema';

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const proveedorId = Number(id);
    if (!Number.isInteger(proveedorId) || proveedorId <= 0) {
      return NextResponse.json({ ok: false, error: 'Bad id' }, { status: 400 });
    }

    const body = await req.json();
    const dto = updateProveedorSchema.parse(body);

    const actualizado = await actualizarProveedor(proveedorId, dto);
    return NextResponse.json({ ok: true, data: actualizado }, { status: 200 });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ ok: false, error: err.errors }, { status: 422 });
    }
    if (err?.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'Proveedor no encontrado' }, { status: 404 });
    }
    if (err?.message === 'CUIT ya registrado') {
      return NextResponse.json({ ok: false, error: err.message }, { status: 409 });
    }
    console.error('[PUT /api/proveedores/:id]', err);
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}
