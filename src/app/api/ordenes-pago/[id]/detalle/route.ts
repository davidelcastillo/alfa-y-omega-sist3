// src/app/api/ordenes-pago/[id]/detalle/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;              // <— esperar params
    const nid = Number(id);
    if (!Number.isFinite(nid)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    const op = await prisma.ordenPago.findUnique({
      where: { id: nid },
      select: {
        id: true,
        fecha: true,
        nroInterno: true,
        observaciones: true,
        estado: true,
        totalPagado: true,
        MetodoPago: { select: { id: true, nombre: true } },
        Proveedores: {
          select: {
            id: true, razonSocial: true, nombre: true, nombreComercial: true,
            codigo: true, genero: true, categoriaFiscalId: true, cuil: true,
            pais: true, provincia: true, localidad: true, barrio: true,
            codigoPostal: true, telefono: true, paginaWeb: true,
            correoElectronico: true, estado: true,
          },
        },
        DetalleOrdenPago: {
          select: {
            montoPagado: true,
            saldoPrevio: true,
            saldoRestante: true,
            ComprobanteProveedor: {
              select: {
                id: true, fecha: true, letra: true, numeroSucursal: true, numero: true,
                total: true, saldo: true, estado: true,
                tipoComprobante: { select: { id: true, nombre: true } },
                proveedor: { select: { id: true, nombre: true } },
                Deposito: { select: { id: true, nombre: true } },
                moneda: true,

                // 👇 agregar ítems del comprobante para poder mostrar “productos”
                detalleComprobante: {
                  select: {
                    cantidad: true,
                    precioUnitario: true,
                    producto: { select: { id: true, nombre: true } },
                  },
                },
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!op) {
      return NextResponse.json({ ok: false, error: "Orden de pago inexistente" }, { status: 404 });
    }

    const detalles = op.DetalleOrdenPago.map((d) => ({
      aplicado: {
        montoPagado: Number(d.montoPagado ?? 0),
        saldoPrevio: Number(d.saldoPrevio ?? 0),
        saldoRestante: Number(d.saldoRestante ?? 0),
      },
      comprobante: {
        id: d.ComprobanteProveedor.id,
        fecha: d.ComprobanteProveedor.fecha,
        tipoComprobante: d.ComprobanteProveedor.tipoComprobante,
        letra: d.ComprobanteProveedor.letra,
        numeroSucursal: d.ComprobanteProveedor.numeroSucursal,
        numero: d.ComprobanteProveedor.numero,
        nro_formateado: formatNro(
          d.ComprobanteProveedor.letra,
          d.ComprobanteProveedor.numeroSucursal,
          d.ComprobanteProveedor.numero
        ),
        total: Number(d.ComprobanteProveedor.total ?? 0),
        saldoActual: Number(d.ComprobanteProveedor.saldo ?? 0),
        estado: d.ComprobanteProveedor.estado,
        deposito: d.ComprobanteProveedor.Deposito,
        proveedor: d.ComprobanteProveedor.proveedor,
        moneda: d.ComprobanteProveedor.moneda ?? null,

        // 👇 aplanamos para el front
        items: d.ComprobanteProveedor.detalleComprobante.map((it) => ({
          id: it.producto.id,
          nombre: it.producto.nombre,
          cantidad: it.cantidad,
          precioUnitario: Number(it.precioUnitario),
        })),
      },
    }));

    const totalAplicado = detalles.reduce((a, r) => a + r.aplicado.montoPagado, 0);
    const saldoRestanteTotal = detalles.reduce((a, r) => a + r.aplicado.saldoRestante, 0);

    return NextResponse.json({
      ok: true,
      data: {
        id: op.id,
        fecha: op.fecha,
        nro_interno: op.nroInterno,
        observaciones: op.observaciones,
        estado: op.estado,
        metodo_pago: op.MetodoPago,
        proveedor: op.Proveedores,
        totales: {
          total_pagado: Number(op.totalPagado ?? totalAplicado),
          comprobantes: detalles.length,
          saldo_restante_total: saldoRestanteTotal,
        },
        detalles,
      },
    });
  } catch (err) {
    console.error("GET /api/ordenes-pago/[id]", err);
    return NextResponse.json(
      { ok: false, error: "Error al obtener detalle de la orden de pago" },
      { status: 500 }
    );
  }
}

function formatNro(letra?: string | null, suc?: string | null, nro?: string | null) {
  const L = (letra ?? "").trim();
  const S = (suc ?? "").toString().padStart(4, "0");
  const N = (nro ?? "").toString().padStart(8, "0");
  if (!L && !S && !N) return null;
  return `${L || "-"}-${S || "0000"}-${N || "00000000"}`;
}
