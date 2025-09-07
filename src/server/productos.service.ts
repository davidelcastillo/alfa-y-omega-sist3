import { prisma } from '@/lib/prisma';
import type { CreateProductoDTO } from '@/app/api/productos/schema';
import { Prisma } from '@/generated/prisma'; // o import { Prisma } from '@prisma/client'

export async function createProducto(data: CreateProductoDTO) {
  // 1) Validar FK existen y reglas de negocio
  const [rubro, marca, unidad] = await Promise.all([
    prisma.rubro.findUnique({ where: { id: data.rubroId } }),
    prisma.marca.findUnique({ where: { id: data.marcaId } }),
    prisma.unidad.findUnique({ where: { id: data.unidadId } }),
  ]);

  
  if (!rubro)  throw new Error('Rubro no existe');
  if (!marca)  throw new Error('Marca no existe');
  if (!unidad) throw new Error('Unidad no existe');
  
  if (data.precioCompra < 0 || data.precioVenta < 0) {
    throw new Error('Precios no pueden ser negativos');
  }
  if (!data.nombre || !data.nombre.trim()) {
    throw new Error('Nombre es requerido');
  }
  if (data.descripcion && !data.descripcion.trim()) {
    data.descripcion = undefined;
  }


  // 2) Crear producto 
  const result = await prisma.$transaction(async (tx) => {
    const producto = await tx.producto.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        rubroId: data.rubroId,
        marcaId: data.marcaId,
        unidadId: data.unidadId,
        precioCompra: data.precioCompra,
        precioVenta: data.precioVenta,
        estado: data.estado ?? true,
      },
    });

    return producto;
  });

  return result;
}


// BUSCADOR AVANZADO ----------------------------------------------------
export type BuscarProductosParams = {
  q?: string;
  marcaId?: number;
  rubroId?: number;
  unidadId?: number;
  estado?: boolean;
  sort?: 'nombre' | 'precioVenta' | 'id' | 'rubroId' | 'marcaId' | 'unidadId' | 'estado';
  order?: 'asc' | 'desc';
  take?: number;
  cursor?: number; // ID del último ítem de la página anterior es de tipo number
};

export async function buscarProductos(params: BuscarProductosParams) {
  const {
    q, marcaId, rubroId, unidadId, estado,
    sort = 'nombre', order = 'asc',
    take: takeParam = 20, cursor,
  } = params;

  const take = Math.min(Math.max(takeParam, 1), 100);

  const where: Prisma.ProductoWhereInput = {};
  if (q && q.trim()) {
    where.OR = [
      { nombre: { contains: q, mode: 'insensitive' } },
      { descripcion: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (marcaId !== undefined)  where.marcaId  = marcaId;
  if (rubroId !== undefined)  where.rubroId  = rubroId;
  if (unidadId !== undefined) where.unidadId = unidadId;
  if (estado !== undefined)   where.estado   = estado;

  const orderBy: Prisma.ProductoOrderByWithRelationInput[] = [
    { [sort]: order } as Prisma.ProductoOrderByWithRelationInput,
    { id: order },
  ];

  const args: Prisma.ProductoFindManyArgs = {
    where,
    orderBy,
    take: take + 1,
    include: {
      marca:  { select: { id: true, nombre: true } },
      rubro:  { select: { id: true, nombre: true } },
      unidad: { select: { id: true, nombre: true } },
    },
  };

  if (typeof cursor === 'number') {
    args.cursor = { id: cursor };
    args.skip = 1;
  }

  const rows = await prisma.producto.findMany(args);
  const hasNextPage = rows.length > take;
  const items = hasNextPage ? rows.slice(0, -1) : rows;
  const nextCursor = items.length ? (items[items.length - 1] as any).id as number : null;

  return { items, nextCursor, hasNextPage };
}
