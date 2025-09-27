// src/app/api/comprobantes-proveedor/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { de } from 'zod/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// helpers
const toInt = (v: string | null, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const parseDate = (v: string | null) => (v ? new Date(v) : null);
const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const fmtNro = (letra?: string | null, suc?: string | null, nro?: string | null) => {
  const L = (letra ?? '').trim();
  const S = (suc ?? '').padStart(4, '0');
  const N = (nro ?? '').padStart(8, '0');
  if (!L && !S && !N) return null;
  return `${L || '-' }-${S || '0000'}-${N || '00000000'}`;
};
// sort whitelist
const parseSort = (raw: string | null) => {
  const s = (raw || '').trim();
  const dir = s.startsWith('-') ? 'desc' : 'asc';
  const key = s.replace(/^-/, '') || 'fecha';
  switch (key) {
    case 'fecha':      return [{ fecha: dir as 'asc' | 'desc' }, { id: 'desc' as const }];
    case 'total':      return [{ total: dir as 'asc' | 'desc' }, { id: 'desc' as const }];
    case 'pendiente':  return [{ saldo: dir as 'asc' | 'desc' }, { id: 'desc' as const }];
    case 'pagado':     return [{ total: dir as 'asc' | 'desc' }, { saldo: (dir === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc' }, { id: 'desc' as const }];
    case 'proveedor':  return [{ proveedor: { nombre: dir as 'asc' | 'desc' } }, { id: 'desc' as const }];
    default:           return [{ fecha: 'desc' as const }, { id: 'desc' as const }];
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // paginación
    const page = Math.max(toInt(searchParams.get('page'), 1), 1);
    const limit = Math.min(Math.max(toInt(searchParams.get('limit'), 20), 10), 100);
    const skip = (page - 1) * limit;

    // filtros
    const proveedorId = searchParams.get('proveedorId');
    const nro = searchParams.get('numero');              // acepta "A-0001-00001234" o parcial
    const fechaDesde = parseDate(searchParams.get('fecha_desde'));
    const fechaHasta = parseDate(searchParams.get('fecha_hasta'));
    const search = searchParams.get('search');
    const sort = searchParams.get('sort'); 
    const depositoId = searchParams.get('depositoId');   // -fecha, fecha, total, -total, proveedor, pendiente, -pagado
    const estado = searchParams.get('estado');           // opcional: true/false

    const where: any = {};

    if (proveedorId) where.proveedorId = Number(proveedorId);

    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) where.fecha.gte = fechaDesde;
      if (fechaHasta) where.fecha.lte = endOfDay(fechaHasta);
    }

    if (depositoId) where.depositoId = Number(depositoId);

    const or: any[] = [];
    if (nro && nro.trim()) {
      const needle = nro.trim();
      or.push(
        { letra: { contains: needle, mode: 'insensitive' } },
        { numeroSucursal: { contains: needle, mode: 'insensitive' } },
        { numero: { contains: needle, mode: 'insensitive' } },
      );
    }
    if (search && search.trim()) {
      const q = search.trim();
      or.push(
        { proveedor: { nombre: { contains: q, mode: 'insensitive' } } },
        { tipoComprobante: { nombre: { contains: q, mode: 'insensitive' } } },
        { letra: { contains: q, mode: 'insensitive' } },
        { numeroSucursal: { contains: q, mode: 'insensitive' } },
        { numero: { contains: q, mode: 'insensitive' } },
      );
    }
    if (or.length) where.OR = or;

    const [total, items] = await Promise.all([
      prisma.comprobanteProveedor.count({ where }),
      prisma.comprobanteProveedor.findMany({
        where,
        orderBy: parseSort(sort),
        skip,
        take: limit,
        select: {
          id: true,
          fecha: true,
          letra: true,
          numeroSucursal: true,
          numero: true,
          total: true,
          saldo: true,
          estado: true,
          proveedor: { select: { id: true, nombre: true } },
          tipoComprobante: { select: { id: true, nombre: true } },
          ordenCompra: { select: { id: true} },
          Deposito: { select: { id: true, nombre: true } }
        },
      }),
    ]);

    const rows = items.map((cp) => {
      const nroFmt = fmtNro(cp.letra, cp.numeroSucursal, cp.numero);
      const total = Number(cp.total ?? 0);
      const pendiente = Number(cp.saldo ?? 0);
      const pagado = Math.max(0, total - pendiente);
      return {
        id: cp.id,
        nro_comprobante: nroFmt,
        proveedor: cp.proveedor
        ? { id: cp.proveedor.id, name: cp.proveedor.nombre }
        : null,
        tipo_comprobante: cp.tipoComprobante?.nombre ?? null,
        ordenCompra: cp.ordenCompra ? { id: cp.ordenCompra.id } : null,
        deposito: cp.Deposito ? { id: cp.Deposito.id, name: cp.Deposito.nombre } : null,
        total,
        pagado,
        pendiente,
        saldo: pendiente,
        fecha: cp.fecha  ? cp.fecha.toISOString().split("T")[0] : null,
        estado: cp.estado,
      };
    });

    return NextResponse.json({
      meta: { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
      items: rows,
    });
  } catch (err: any) {
    console.error('GET /api/comprobantes-proveedor error', err);
    return NextResponse.json(
      { error: 'Error al listar comprobantes del proveedor', details: err?.message },
      { status: 500 },
    );
  }
}
