// src/server/productos.queries.ts
import { prisma } from '@/lib/prisma'

export type Catalogo = { id: number; nombre: string }

export async function fetchCatalogos() {
  const [rubros, unidades] = await Promise.all([
    prisma.rubro.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'asc' } }),
    prisma.unidad.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'asc' } }),
  ])
  return { rubros, unidades } // 👈 { rubros: Catalogo[], unidades: Catalogo[] }
}

/** Lo que trae de DB por producto */
export type DBProductoRow = {
  id: number
  nombre: string
  descripcion: string | null
  estado: boolean
  rubroId: number
  marcaId: number
  unidadId: number
  rubroNombre: string
  marcaNombre: string
  unidadNombre: string
}

export async function fetchProductos(): Promise<DBProductoRow[]> {
  const rows = await prisma.producto.findMany({
    include: {
      rubro:  { select: { nombre: true } },
      marca:  { select: { nombre: true } },
      unidad: { select: { nombre: true } },
    },
    orderBy: { id: 'asc' },
  })

  return rows.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion ?? '',
    estado: p.estado,
    rubroId: p.rubroId,
    marcaId: p.marcaId,
    unidadId: p.unidadId,
    rubroNombre: p.rubro?.nombre ?? '',
    marcaNombre: p.marca?.nombre ?? '',
    unidadNombre: p.unidad?.nombre ?? '',
  }))
}
