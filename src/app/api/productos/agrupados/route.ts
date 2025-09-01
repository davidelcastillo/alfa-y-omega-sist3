// src/app/api/productos/agrupado/route.ts
import { NextResponse } from 'next/server'; // para respuestas HTTP
import { Prisma } from '@/generated/prisma'; // importamos Prisma para los tipos
import { prisma } from '@/lib/prisma'; // importamos prisma para hacer consultas a la base de datos

// where tipado, realiza el filtrado para el groupBy
function buildWhere(params: URLSearchParams): Prisma.ProductoWhereInput {
  const where: Prisma.ProductoWhereInput = {};

  const rubroId  = params.get('rubroId');
  const marcaId  = params.get('marcaId');
  const unidadId = params.get('unidadId');
  const estado   = params.get('estado');
  const q        = params.get('q');

  if (rubroId)  where.rubroId  = Number(rubroId);
  if (marcaId)  where.marcaId  = Number(marcaId);
  if (unidadId) where.unidadId = Number(unidadId);
  if (estado === 'true' || estado === 'false') where.estado = estado === 'true';

  if (q) {
    where.OR = [
      { nombre:      { contains: q, mode: 'insensitive' } },
      { descripcion: { contains: q, mode: 'insensitive' } },
    ];
  }
  return where;
}

// convierte 'by' -> enum de campos escalares de Prisma, que es lo que espera groupBy
function toScalarFieldEnum(
  by: 'rubro' | 'marca' | 'unidad' | 'estado'
): Prisma.ProductoScalarFieldEnum {
  switch (by) {
    case 'rubro':  return Prisma.ProductoScalarFieldEnum.rubroId;
    case 'marca':  return Prisma.ProductoScalarFieldEnum.marcaId;
    case 'unidad': return Prisma.ProductoScalarFieldEnum.unidadId;
    case 'estado': return Prisma.ProductoScalarFieldEnum.estado;
  }
}

type GroupRow = {
  key: number | boolean | null;
  name: string;
  count: number;
  totalPrecioVenta: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const by = searchParams.get('by') as 'rubro' | 'marca' | 'unidad' | 'estado' | null;

  if (!by) {
    return NextResponse.json({ ok: false, error: "Parámetro 'by' requerido" }, { status: 400 });
  }

  const where = buildWhere(searchParams);
  const fieldEnum = toScalarFieldEnum(by);

  const groups = await prisma.producto.groupBy({
    by: [fieldEnum],        // el campo por el que se agrupa   
    where,
    _count: { _all: true },
    _sum: { precioVenta: true },
  });

  // Diccionario de nombres (solo para rubro/marca/unidad)
  let nameMap: Record<number, string> = {};
  if (by === 'rubro')  nameMap = Object.fromEntries((await prisma.rubro.findMany()).map(r => [r.id, r.nombre]));
  if (by === 'marca')  nameMap = Object.fromEntries((await prisma.marca.findMany()).map(m => [m.id, m.nombre]));
  if (by === 'unidad') nameMap = Object.fromEntries((await prisma.unidad.findMany()).map(u => [u.id, u.nombre]));

  // Extraer la clave del objeto 
  const fieldKey = String(fieldEnum); // 'rubroId' | 'marcaId' | 'unidadId' | 'estado'

  const data: GroupRow[] = groups.map(g => {
    const key = (g as unknown as Record<string, number | boolean | null>)[fieldKey];
    return {
      key: key ?? null,
      name: by === 'estado'
        ? (key ? 'Activo' : 'Inactivo')
        : nameMap[(key as number)] ?? '(sin nombre)',
      count: g._count._all,
      totalPrecioVenta: g._sum.precioVenta ?? 0,
    };
  });

  return NextResponse.json({ ok: true, data });
}
