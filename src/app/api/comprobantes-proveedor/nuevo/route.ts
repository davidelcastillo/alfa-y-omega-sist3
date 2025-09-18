// src/app/api/comprobantes-proveedor/nuevo/route.ts
import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { crearComprobanteProveedorConMovimiento } from '@/server/comprobantes-proveedor.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const detalleSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive(),
  precioUnitario: z.coerce.number().positive(),
  descuento: z.coerce.number().min(0).max(100).optional(),
  observaciones: z.string().optional(),
});

const bodySchema = z.object({
  ordenCompraId: z.coerce.number().int().positive(),
  proveedorId: z.coerce.number().int().positive(),
  tipoComprobanteId: z.coerce.number().int().positive(),
  fecha: z.string().refine(v => !Number.isNaN(Date.parse(v)), 'fecha inválida (ISO)'),
  hora: z.string().optional(),
  letra: z.string().optional(),
  numeroSucursal: z.string().optional(),
  numero: z.string().optional(),
  metodoPagoId: z.coerce.number().int().positive().optional(),
  observaciones: z.string().optional(),
  depositoId: z.coerce.number().int().positive().optional(),
  tipoMovimientoId: z.coerce.number().int().positive().optional(), // si no viene, se toma uno con saldo=true
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
    // Errores de negocio que conviene exponer
    if (/(inexistente|inactivo|no hay dep[oó]sito|ya existe|corresponde|inv[aá]lid)/i.test(msg)) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    console.error('POST /api/comprobantes-proveedor/nuevo', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
