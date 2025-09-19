import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { crearComprobanteProveedorConMovimiento } from '@/server/comprobantes-proveedor.service';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- GET: datos para el formulario ----------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ocId = Number(searchParams.get('ordenCompraId') ?? 'NaN');
    if (!Number.isFinite(ocId)) {
      return NextResponse.json({ ok: false, error: 'ordenCompraId requerido' }, { status: 400 });
    }

    // ❌ NO existe "deposito" como relación en OrdenCompra
    // ✅ Pedimos depositoId y luego resolvemos el depósito aparte
    const oc = await prisma.ordenCompra.findUnique({
      where: { id: ocId },
      select: {
        id: true,
        nroOC: true,
        fecha: true,
        proveedor: { select: { id: true, nombre: true } }, // esta relación sí existe
        depositoId: true,
        detalleOrdenCompra: {
          select: {
            productoId: true,
            cantidad: true,
            precioUnitario: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                unidad: { select: { nombre: true } },
              },
            },
          },
        },
      },
    });

    if (!oc) return NextResponse.json({ ok: false, error: 'Orden de compra inexistente' }, { status: 404 });
    if (!oc.depositoId) return NextResponse.json({ ok: false, error: 'La OC no tiene depósito asignado' }, { status: 400 });

    // Resolver depósito por id
    const deposito = await prisma.deposito.findUnique({
      where: { id: oc.depositoId },
      select: { id: true, nombre: true },
    });

    const [tiposComprobante, metodosPago] = await Promise.all([
      prisma.tipoComprobante.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'asc' } }),
      prisma.metodoPago.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'asc' } }),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        oc: {
          id: oc.id,
          nro: oc.nroOC,
          fecha: oc.fecha,
          proveedor: oc.proveedor,                 // read-only
          deposito: deposito ? { id: deposito.id, nombre: deposito.nombre } : null, // read-only
          items: oc.detalleOrdenCompra.map(d => ({
            productoId: d.productoId,
            producto: d.producto?.nombre ?? null,
            unidad: d.producto?.unidad?.nombre ?? null,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
          })),
        },
        opciones: {
          tiposComprobante,
          metodosPago,
        },
      },
    });
  } catch (err: unknown) {
    console.error('GET /api/comprobantes-proveedor/nuevo', err);
    return NextResponse.json(
      { ok: false, error: 'Error al preparar alta de comprobante', details: (err as Error)?.message },
      { status: 500 },
    );
  }
}
// ---------- POST: alta (usa proveedor/deposito de la OC y valida items) ----------
const detalleRawSchema = z
  .object({
    // puede venir como productId o productoId
    productId: z.coerce.number().int().positive().optional(),
    productoId: z.coerce.number().int().positive().optional(),

    // cantidad: quantity o cantidad
    quantity: z.coerce.number().int().positive().optional(),
    cantidad: z.coerce.number().int().positive().optional(),

    // precio unitario: unitPrice o precioUnitario
    unitPrice: z.coerce.number().positive().optional(),
    precioUnitario: z.coerce.number().positive().optional(),

    // descuento / discount
    discount: z.coerce.number().min(0).max(100).optional(),
    descuento: z.coerce.number().min(0).max(100).optional(),

    // observations / observaciones
    observations: z.string().optional(),
    observaciones: z.string().optional(),
  })
  // debe traer al menos id/cantidad/precio
  .refine(
    (d) => Boolean(d.productId ?? d.productoId) && Boolean(d.quantity ?? d.cantidad) && Boolean(d.unitPrice ?? d.precioUnitario),
    { message: "Detalle inválido: productId/cantidad/unitPrice requeridos" }
  )
  .transform((d) => ({
    productoId: Number(d.productoId ?? d.productId),
    cantidad: Number(d.cantidad ?? d.quantity),
    precioUnitario: Number(d.precioUnitario ?? d.unitPrice),
    descuento: d.descuento ?? d.discount ?? 0,
    observaciones: d.observaciones ?? d.observations ?? null,
  }));

// Schema para validar el body completo
const bodySchema = z.object({
  ordenCompraId: z.coerce.number().int().positive(),
  // opcional: si tu frontend manda proveedorId lo respetamos; si no, lo tomamos desde la OC
  proveedorId: z.coerce.number().int().positive().optional(),
  depositoId: z.coerce.number().int().positive().optional(),

  tipoComprobanteId: z.coerce.number().int().positive(),
  // acepta number (coerce) o null/undefined
  tipoMovimientoId: z.coerce.number().int().positive().optional().nullable(),
  metodoPagoId: z.coerce.number().int().positive().optional().nullable(),

  fecha: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "fecha inválida (ISO)"),
  hora: z.string().optional().nullable(),
  letra: z.string().optional().nullable(),
  numeroSucursal: z.string().optional().nullable(),
  numero: z.string().optional().nullable(),
  moneda: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),

  detalles: z.array(detalleRawSchema).min(1, "Debe incluir al menos un detalle"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log("POST /api/comprobantes-proveedor/nuevo body:", JSON.stringify(json, null, 2)); // temporal

    const parsed = bodySchema.parse(json); // parsed.detalles ya viene normalizado por transform

    // si no viene proveedorId o depositoId en el body, sacalo de la OC
    const oc = await prisma.ordenCompra.findUnique({
      where: { id: parsed.ordenCompraId },
      select: { id: true, proveedorId: true, depositoId: true },
    });
    if (!oc) return NextResponse.json({ ok: false, error: "Orden de compra inexistente" }, { status: 404 });

    const dto = {
      ordenCompraId: parsed.ordenCompraId,
      proveedorId: parsed.proveedorId ?? oc.proveedorId,
      tipoComprobanteId: parsed.tipoComprobanteId,
      fecha: parsed.fecha,
      hora: parsed.hora ?? null,
      letra: parsed.letra ?? null,
      numeroSucursal: parsed.numeroSucursal ?? null,
      numero: parsed.numero ?? null,
      metodoPagoId: parsed.metodoPagoId ?? null,
      observaciones: parsed.observaciones ?? null,
      depositoId: parsed.depositoId ?? oc.depositoId ?? null,
      tipoMovimientoId: parsed.tipoMovimientoId ?? null,
      detalles: parsed.detalles.map((d: any) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        descuento: d.descuento ?? null,
        observaciones: d.observaciones ?? null,
      })),
    };

    // Llamamos a tu servicio (que espera nombres en español)
    const result = await crearComprobanteProveedorConMovimiento(dto as any);
    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      console.error("Zod validation error:", JSON.stringify(err.issues, null, 2));
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", issues: err.issues }, { status: 422 });
    }
    const msg = (err as Error)?.message ?? "Internal Error";
    if (/(inexistente|inactivo|no pertenece|ya existe|inv[aá]lid|dep[oó]sito)/i.test(msg)) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    console.error("POST /api/comprobantes-proveedor/nuevo", err);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
