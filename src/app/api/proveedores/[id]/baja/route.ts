import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Nota Next 15: params es async; hay que await
export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const provId = Number(id);
  if (!Number.isInteger(provId) || provId <= 0) {
    return NextResponse.json({ ok: false, error: 'Bad id' }, { status: 400 });
  }

  try {
    const existente = await prisma.proveedores.findUnique({
      where: { id: provId },
      select: { id: true, estado: true },
    });
    if (!existente) {
      return NextResponse.json({ ok: false, error: 'Proveedor no encontrado' }, { status: 404 });
    }

    // Idempotente: si ya está inactivo, devolvemos 200 igualmente
   /* if (existente.estado === false) {
      const data = await prisma.proveedores.findUnique({
        where: { id: provId },
        select: {
          id: true, nombre: true, razonSocial: true, nombreComercial: true,
          cuil: true, provincia: true, localidad: true,
          correoElectronico: true, telefono: true, estado: true,
        },
      });
      return NextResponse.json({ ok: true, data, meta: { updated: false, reason: 'already_inactive' } });
    }
*/
    const actualizado = await prisma.proveedores.update({
      where: { id: provId },
      data: { estado: !existente.estado }, // CAMBIO FALSE POR !existente.estado
      select: {
        id: true, nombre: true, razonSocial: true, nombreComercial: true,
        cuil: true, provincia: true, localidad: true,
        correoElectronico: true, telefono: true, estado: true,
      },
    });

    return NextResponse.json({ ok: true, data: actualizado, meta: { updated: true } });
  } catch (err) {
    console.error('[PATCH /api/proveedores/:id/baja]', err);
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}
