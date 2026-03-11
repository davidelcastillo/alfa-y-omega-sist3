//Traer los detalles de una orden de compra por su ID
// src\app\api\ordenes-compra\[id]\detalle\route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);   // 👈 así está bien
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { ok: false, error: "ID inválido" },
        { status: 400 }
      );
    }
    // ... resto del código


    // Cabecera + renglones con datos de producto
    const oc = await prisma.ordenCompra.findUnique({
    where: { id },
    select: {
      id: true,
      fecha: true,
      hora: true,
      proveedorId: true,
      depositoId: true,
      subTotal: true,
      otrosGastos: true,
      total: true,
      fechaEntrega: true,
      estado: true,
      observaciones: true,
      proveedor: { select: { id: true, nombre: true } },
      detalleOrdenCompra: {   // 👈 este es el correcto según tu schema
        select: {
          productoId: true,
          cantidad: true,
          precioUnitario: true,
          producto: {
            select: {
              id: true,
              nombre: true,
              rubro: { select: { nombre: true } },
              marca: { select: { nombre: true } },
              unidad: { select: { nombre: true } },
            },
          },
        },
      },
    },
  });


    if (!oc) return NextResponse.json({ ok: false, error: 'Orden de compra inexistente' }, { status: 404 });

    // Deposito (no hay relación en el schema, lo resolvemos por id)
    const deposito = oc.depositoId
      ? await prisma.deposito.findUnique({
          where: { id: oc.depositoId },
          select: { id: true, nombre: true },
        })
      : null;

    // Transformar renglones y calcular totales
    const items = oc.detalleOrdenCompra.map((r) => {
      const totalLinea = Number(r.cantidad) * Number(r.precioUnitario);
      return {
        productoId: r.productoId,
        producto: r.producto?.nombre ?? null,
        rubro: r.producto?.rubro?.nombre ?? null,
        marca: r.producto?.marca?.nombre ?? null,
        unidad: r.producto?.unidad?.nombre ?? null,
        cantidad: Number(r.cantidad),
        precioUnitario: Number(r.precioUnitario),
        totalLinea,
      };
    });

    const subTotalCalc = items.reduce((acc, it) => acc + it.totalLinea, 0);
    const otrosGastos = Number(oc.otrosGastos ?? 0);
    const totalCalc = subTotalCalc + otrosGastos;

    return NextResponse.json({
      ok: true,
      data: {
        id: oc.id,
        fecha: oc.fecha instanceof Date ? oc.fecha.toISOString() : oc.fecha,
        hora: oc.hora,
        proveedor: oc.proveedor,
        deposito: deposito ? { id: deposito.id, nombre: deposito.nombre } : null,
        fechaEntrega: oc.fechaEntrega,
        estado: oc.estado,
        observaciones: oc.observaciones,
        totales: {
          items: items.length,
          subTotal_db: Number(oc.subTotal ?? 0),
          subTotal_calc: subTotalCalc,
          otrosGastos,
          total_db: Number(oc.total ?? 0),
          total_calc: totalCalc,
        },
        items,
      },
    });
  } catch (err: any) {
    console.error('GET /api/ordenes-compra/[id]', err);
    return NextResponse.json({ ok: false, error: 'Error al obtener la orden de compra', details: err?.message }, { status: 500 });
  }
}
