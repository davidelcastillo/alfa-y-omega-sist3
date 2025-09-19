import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { crearComprobanteProveedorConMovimiento } from '@/server/comprobantes-proveedor.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
const detalleSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive(),
  precioUnitario: z.coerce.number().positive(),
  descuento: z.coerce.number().min(0).max(100).optional(),
  observaciones: z.string().optional(),
});

const bodySchema = z.object({
  ordenCompraId: z.coerce.number().int().positive(),
  tipoComprobanteId: z.coerce.number().int().positive(),
  fecha: z.string().refine(v => !Number.isNaN(Date.parse(v)), 'fecha inválida (ISO)'),
  hora: z.string().optional(),
  letra: z.string().optional(),
  numeroSucursal: z.string().optional(),
  numero: z.string().optional(),
  metodoPagoId: z.coerce.number().int().positive().optional(),
  observaciones: z.string().optional(),
  detalles: z.array(detalleSchema).min(1, 'Debe incluir al menos un detalle'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    const result = await crearComprobanteProveedorConMovimiento(data);
    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: 'VALIDATION_ERROR', issues: err.issues }, { status: 422 });
    }
    const msg = (err as Error)?.message ?? 'Internal Error';
    if (/(inexistente|inactivo|no pertenece|ya existe|inv[aá]lid|dep[oó]sito)/i.test(msg)) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    console.error('POST /api/comprobantes-proveedor/nuevo', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
