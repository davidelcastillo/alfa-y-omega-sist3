// src/app/api/comprobantes-proveedor/nuevo/route.ts
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { crearComprobanteProveedorConMovimiento } from "@/server/comprobantes-proveedor.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Schema para validar cada ítem del comprobante
const detalleSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
  observations: z.string().optional(),
});

// Schema para validar el body completo
const bodySchema = z.object({
  ordenCompraId: z.string(),
  proveedorId: z.string(),
  depositoId: z.string(),
  tipoComprobanteId: z.string(),
  metodoPagoId: z.string(),
  fecha: z.string().refine(v => !Number.isNaN(Date.parse(v)), "Fecha inválida (ISO)"),
  hora: z.string().optional(),
  letra: z.string().optional(),
  numeroSucursal: z.string().optional(),
  numero: z.string().optional(),
  tipoMovimientoId: z.string().optional(), // opcional, si backend asigna por defecto
  moneda: z.string().optional(),
  observaciones: z.string().optional(),
  detalles: z.array(detalleSchema).min(1, "Debe incluir al menos un detalle"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    // Llamada al servicio que crea el comprobante y el movimiento
    const result = await crearComprobanteProveedorConMovimiento({
      ordenCompraId: Number(data.ordenCompraId),
  proveedorId: Number(data.proveedorId),
  depositoId: Number(data.depositoId),
  tipoComprobanteId: Number(data.tipoComprobanteId),
  metodoPagoId: Number(data.metodoPagoId),
  fecha: data.fecha,
  hora: data.hora,
  letra: data.letra,
  numeroSucursal: data.numeroSucursal,
  numero: data.numero,
  tipoMovimientoId: data.tipoMovimientoId ? Number(data.tipoMovimientoId) : undefined,
  observaciones: data.observaciones,
  detalles: data.detalles.map(d => ({
    productoId: d.productId,       // 🔹 rename
    cantidad: d.quantity,          // 🔹 rename
    precioUnitario: d.unitPrice,   // 🔹 rename
    descuento: d.discount ?? 0,
    observaciones: d.observations ?? "",
      })),
    });

    // Devuelve comprobante completo con relaciones (proveedor, depósito, tipoComprobante, métodoPago, ítems)
    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", issues: err.issues },
        { status: 422 }
      );
    }

    const msg = (err as Error)?.message ?? "Internal Error";
    if (/(inexistente|inactivo|no hay dep[oó]sito|ya existe|corresponde|inv[aá]lid)/i.test(msg)) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    console.error("POST /api/comprobantes-proveedor/nuevo", err);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
