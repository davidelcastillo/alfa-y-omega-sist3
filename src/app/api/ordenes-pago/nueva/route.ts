import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import {
  OrdenPagoCreateSchema,
  OrdenPagoInitQuerySchema,
} from "@/lib/ordenes-pago/types";
import { crearOrdenPago } from "@/server/ordenes-pago.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET: prefill para el form (comprobantes pendientes del proveedor + métodos de pago) */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = OrdenPagoInitQuerySchema.parse({
      proveedorId: searchParams.get("proveedorId"),
    });

    const proveedor = await prisma.proveedores.findUnique({
      where: { id: q.proveedorId },
      select: { id: true, nombre: true, estado: true },
    });
    if (!proveedor)
      return NextResponse.json(
        { ok: false, error: "Proveedor inexistente" },
        { status: 404 }
      );
    if (!proveedor.estado)
      return NextResponse.json(
        { ok: false, error: "Proveedor inactivo" },
        { status: 400 }
      );

    const [metodosPago, comprobantesPendientes] = await Promise.all([
      prisma.metodoPago.findMany({
        select: { id: true, nombre: true },
        orderBy: { nombre: "asc" },
      }),
      prisma.comprobanteProveedor.findMany({
        where: { proveedorId: q.proveedorId, saldo: { gt: 0 }, estado: true },
        select: {
          id: true,
          fecha: true,
          letra: true,
          numeroSucursal: true,
          numero: true,
          total: true,
          saldo: true,
        },
        orderBy: [{ fecha: "desc" }, { id: "desc" }],
      }),
    ]);

    return NextResponse.json({
      ok: true,
      data: { proveedor, metodosPago, comprobantesPendientes },
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", issues: err.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error: "Error al preparar alta de OP",
        details: (err as Error)?.message,
      },
      { status: 500 }
    );
  }
}

/** POST: crear Orden de Pago */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = OrdenPagoCreateSchema.parse(json);
    const result = await crearOrdenPago(data);
    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", issues: err.issues },
        { status: 422 }
      );
    }
    const msg = (err as Error)?.message ?? "Internal Error";
    if (/(inexistente|inactivo|saldo|excede|otro proveedor)/i.test(msg)) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    console.error("POST /api/ordenes-pago/nueva", err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
