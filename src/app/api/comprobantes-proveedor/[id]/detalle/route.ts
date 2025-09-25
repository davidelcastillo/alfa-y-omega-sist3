// src/app/api/comprobantes-proveedor/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const fmtNro = (letra?: string | null, suc?: string | null, nro?: string | null) => {
  const L = (letra ?? '').trim();
  const S = (suc ?? '').toString().padStart(4, '0');
  const N = (nro ?? '').toString().padStart(8, '0');
  if (!L && !S && !N) return null;
  return `${L || '-' }-${S || '0000'}-${N || '00000000'}`;
};

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, error: 'ID inválido' }, { status: 400 });
    }

    // Cabecera + renglones
    const cp = await prisma.comprobanteProveedor.findUnique({
      where: { id },
      select: {
        id: true,
        fecha: true,
        hora: true,
        proveedorId: true,
        tipoComprobanteId: true,
        letra: true,
        numeroSucursal: true,
        numero: true,
        total: true,
        saldo: true,
        estado: true,
        observaciones: true,
        ordenCompra: { select: { id: true, nroOC: true } },
        proveedor: { select: { id: true, nombre: true } },
        tipoComprobante: { select: { id: true, nombre: true } },
        detalleComprobante: {
          select: {
            productoId: true,
            cantidad: true,
            precioUnitario: true,
            descuento: true,
            precioXCantidad: true,
            observaciones: true,
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

    if (!cp) return NextResponse.json({ ok: false, error: 'Comprobante inexistente' }, { status: 404 });

    // Intentar ubicar el movimiento generado para este CP (si existe)
    const mov = await prisma.movimientoStock.findFirst({
      where: { numeroComprobante: `CP-${cp.id}` },
      select: { id: true, deposito: { select: { id: true, nombre: true } } },
    });

    // Transformar renglones + cálculos
    const items = cp.detalleComprobante.map((r) => {
      const desc = r.descuento ? r.descuento / 100 : 0;
      const totalLineaCalc =
        r.precioXCantidad ??
        (Number(r.cantidad) * Number(r.precioUnitario) * (1 - desc));
      return {
        productoId: r.productoId,
        producto: r.producto?.nombre ?? null,
        rubro: r.producto?.rubro?.nombre ?? null,
        marca: r.producto?.marca?.nombre ?? null,
        unidad: r.producto?.unidad?.nombre ?? null,
        cantidad: Number(r.cantidad),
        precioUnitario: Number(r.precioUnitario),
        descuento: r.descuento ?? null,
        totalLinea: totalLineaCalc,
        observaciones: r.observaciones ?? null,
      };
    });

    const total_calc = items.reduce((acc, it) => acc + it.totalLinea, 0);
    const total_db = Number(cp.total ?? 0);
    const saldo_db = Number(cp.saldo ?? 0);

    // Monto de referencia para "pagado": si no hay total en DB, usamos calculado
    const baseTotal = cp.total ?? total_calc;
    const baseSaldo = cp.saldo ?? baseTotal;
    const pagado_calc = Math.max(0, baseTotal - baseSaldo);

    return NextResponse.json({
      ok: true,
      data: {
        id: cp.id,
        fecha: cp.fecha,
        hora: cp.hora,
        nro_comprobante: fmtNro(cp.letra, cp.numeroSucursal, cp.numero),
        proveedor: cp.proveedor,                       // { id, nombre }
        tipo_comprobante: cp.tipoComprobante?.nombre ?? null,
        orden_compra: cp.ordenCompra
          ? { id: cp.ordenCompra.id, nro: cp.ordenCompra.nroOC }
          : null,
        deposito: mov?.deposito ? { id: mov.deposito.id, nombre: mov.deposito.nombre } : null,
        estado: cp.estado,
        observaciones: cp.observaciones,
        totales: {
          items: items.length,
          total_db,
          total_calc,
          saldo_db,
          pagado_calc,
        },
        items,
      },
    });
  } catch (err: any) {
    console.error('GET /api/comprobantes-proveedor/[id]', err);
    return NextResponse.json(
      { ok: false, error: 'Error al obtener comprobante del proveedor', details: err?.message },
      { status: 500 },
    );
  }
}
