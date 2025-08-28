import { prisma } from '@/lib/prisma';
import type { CreateProductoDTO } from '@/app/api/productos/schema';

export async function createProducto(data: CreateProductoDTO) {
  // 1) Validar FK existen
  const [rubro, marca, unidad] = await Promise.all([
    prisma.rubro.findUnique({ where: { id: data.rubroId } }),
    prisma.marca.findUnique({ where: { id: data.marcaId } }),
    prisma.unidad.findUnique({ where: { id: data.unidadId } }),
  ]);

  if (!rubro)  throw new Error('Rubro no existe');
  if (!marca)  throw new Error('Marca no existe');
  if (!unidad) throw new Error('Unidad no existe');

  // 2) Crear producto (y opcionalmente stocks por depósito)
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
