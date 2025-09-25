import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { ok: false, error: "ID inválido" },
        { status: 400 }
      );
    }

    const op = await prisma.ordenPago.findUnique({
      where: { id },
      select: {
        id: true,
        fecha: true,
        nroInterno: true,
        observaciones: true,
        estado: true,
        totalPagado: true,
        MetodoPago: { select: { id: true, nombre: true } },
        Proveedores: {
          // “datos completos de proveedor”
          select: {
            id: true,
            razonSocial: true,
            nombre: true,
            nombreComercial: true,
            codigo: true,
            genero: true,
            categoriaFiscalId: true,
            cuil: true,
            pais: true,
            provincia: true,
            localidad: true,
            barrio: true,
            codigoPostal: true,
            telefono: true,
            paginaWeb: true,
            correoElectronico: true,
            estado: true,
          },
        },
        DetalleOrdenPago: {
          select: {
            montoPagado: true,
            saldoPrevio: true,
            saldoRestante: true,
            ComprobanteProveedor: {
              // “datos completos de facturas/comprobantes”
              select: {
                id: true,
                fecha: true,
                letra: true,
                numeroSucursal: true,
                numero: true,
                total: true,
                saldo: true,
                estado: true,
                tipoComprobante: { select: { id: true, nombre: true } },
                proveedor: { select: { id: true, nombre: true } },
                Deposito: { select: { id: true, nombre: true } },
                moneda: true,
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!op) {
      return NextResponse.json(
        { ok: false, error: "Orden de pago inexistente" },
        { status: 404 }
      );
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
      },
    }));

    const totalAplicado = detalles.reduce(
      (a, r) => a + r.aplicado.montoPagado,
      0
    );
    const saldoRestanteTotal = detalles.reduce(
      (a, r) => a + r.aplicado.saldoRestante,
      0
    );

    return NextResponse.json({
      ok: true,
      data: {
        id: op.id,
        fecha: op.fecha,
        nro_interno: op.nroInterno,
        observaciones: op.observaciones,
        estado: op.estado,
        metodo_pago: op.MetodoPago,
        proveedor: op.Proveedores, // completo
        totales: {
          total_pagado: Number(op.totalPagado ?? totalAplicado),
          comprobantes: detalles.length,
          saldo_restante_total: saldoRestanteTotal,
        },
        detalles,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/ordenes-pago/[id]", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Error al obtener detalle de la orden de pago",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

/** A-0001-00001234 */
function formatNro(
  letra?: string | null,
  suc?: string | null,
  nro?: string | null
) {
  const L = (letra ?? "").trim();
  const S = (suc ?? "").toString().padStart(4, "0");
  const N = (nro ?? "").toString().padStart(8, "0");
  if (!L && !S && !N) return null;
  return `${L || "-"}-${S || "0000"}-${N || "00000000"}`;
}
