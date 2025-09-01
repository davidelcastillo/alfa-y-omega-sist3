// src/app/api/productos/route.ts
import { NextResponse } from 'next/server';
import { createProducto } from '@/server/productos.service';
import { createProductoSchema } from './schema';
import { ZodError } from 'zod';

import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

// ------------------ POST: crear un nuevo producto ------------------
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = createProductoSchema.parse(json); // valida DTO

    const nuevo = await createProducto(data);

    return NextResponse.json({ ok: true, data: nuevo }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno';

    if (typeof msg === 'string' && msg.includes('no existe')) {
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: err.issues }, { status: 422 });
    }
    console.error('[POST /api/productos]', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// ------------------ Helpers comunes (tipados) ------------------
function parseBool(v: string | null): boolean | undefined {
  if (v === null) return undefined;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

// IMPORTANTE: usamos todo en minúsculas porque abajo convertimos el campo a lowerCase
const ALLOWED_SORT = new Set(['nombre', 'preciocompra', 'precioventa', 'estado', 'rubro', 'marca', 'unidad']);

// Construye orderBy tipado
function buildOrderBy(sortParam: string | null): Prisma.ProductoOrderByWithRelationInput[] {
  if (!sortParam) return [{ nombre: 'asc' }];

  const parts = sortParam.split(',').map(s => s.trim()).filter(Boolean);
  const orderBy: Prisma.ProductoOrderByWithRelationInput[] = [];

  for (const part of parts) {
    const [rawField, rawDir] = part.split(':').map(s => s?.trim());
    const field = rawField?.toLowerCase();
    const dir: 'asc' | 'desc' = rawDir === 'desc' ? 'desc' : 'asc';

    if (!field || !ALLOWED_SORT.has(field)) continue;

    // Campos simples (map a camelCase reales del modelo)
    if (['nombre', 'preciocompra', 'precioventa', 'estado'].includes(field)) {
      const map: Record<string, keyof Prisma.ProductoOrderByWithRelationInput> = {
        nombre: 'nombre',
        preciocompra: 'precioCompra',
        precioventa: 'precioVenta',
        estado: 'estado',
      };
      const key = map[field];
      orderBy.push({ [key]: dir } as Prisma.ProductoOrderByWithRelationInput);
      continue;
    }

    // Relaciones: ordenar por nombre
    if (field === 'rubro')  orderBy.push({ rubro:  { nombre: dir } });
    if (field === 'marca')  orderBy.push({ marca:  { nombre: dir } });
    if (field === 'unidad') orderBy.push({ unidad: { nombre: dir } });
  }

  return orderBy.length ? orderBy : [{ nombre: 'asc' }];
}

// Construye where tipado
function buildWhere(params: URLSearchParams): Prisma.ProductoWhereInput {
  const where: Prisma.ProductoWhereInput = {};

  const rubroId  = params.get('rubroId');
  const marcaId  = params.get('marcaId');
  const unidadId = params.get('unidadId');
  const estado   = parseBool(params.get('estado'));
  const q        = params.get('q');

  if (rubroId)  where.rubroId  = Number(rubroId);
  if (marcaId)  where.marcaId  = Number(marcaId);
  if (unidadId) where.unidadId = Number(unidadId);
  if (typeof estado === 'boolean') where.estado = estado;

  if (q) {
    where.OR = [
      { nombre:      { contains: q, mode: 'insensitive' } },
      { descripcion: { contains: q, mode: 'insensitive' } },
    ];
  }
  return where;
}

// ------------------ GET: listado con filtros/orden/paginación ------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page     = Math.max(1, Number(searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') ?? 20)));
  const skip     = (page - 1) * pageSize;

  const orderBy  = buildOrderBy(searchParams.get('sort'));
  const where    = buildWhere(searchParams);

  const [items, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: {
        rubro:  { select: { id: true, nombre: true } },
        marca:  { select: { id: true, nombre: true } },
        unidad: { select: { id: true, nombre: true } },
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.producto.count({ where }),
  ]);

  return NextResponse.json({
    ok: true,
    data: { items, total, page, pageSize, appliedSort: orderBy }
  });
}
