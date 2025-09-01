'use client'

import { useMemo, useState } from 'react'
import StatsCards from '@/components/productos/StatsCards'
import Filters, { type ProductFilters } from '@/components/productos/Filters'
import ProductsTable from '@/components/productos/ProductsTable'
import ProductModal from '@/components/productos/ProductModal'

import type { UIProduct } from '@/lib/types'
import type { Catalogo } from '@/server/productos.queries'
import type { Product } from '@/lib/types' // para el modal

const DEFAULT_FILTERS: ProductFilters = { search: '', rubroId: '', unidadId: '', estado: '' }

export default function ProductsPageClient({
  initialProducts,
  rubros,
  unidades,
}: {
  initialProducts: UIProduct[]
  rubros: Catalogo[]
  unidades: Catalogo[]
}) {

    const [products, setProducts] = useState<UIProduct[]>(initialProducts)

const [filters, setFilters] = useState<ProductFilters>({
  search: '',
  rubroId: '',
  unidadId: '',
  estado: '',
})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  // Filtrado client-side sobre lo traído de DB
/*  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = filters.search.toLowerCase()
      const bySearch = !q || (p.descripcion + ' ' + p.marca).toLowerCase().includes(q)
      const byRubro  = !filters.rubroId  || p.rubroId  === filters.rubroId
      const byUnidad = !filters.unidadId || p.unidadId === filters.unidadId
      const byEstado = !filters.estado
        || (filters.estado === 'Activo' && p.estadoBool)
        || (filters.estado === 'Inactivo' && !p.estadoBool)
      return bySearch && byRubro && byUnidad && byEstado
    })
  }, [products, filters])*/
  const filtered = useMemo(() => {
  // normaliza: minusculas + saca acentos
  const norm = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  const q = norm(filters.search.trim());

  return products.filter((p) => {
    const searchable = norm(
      [p.nombre, p.marca, p.rubro, p.unidad, p.descripcion ?? ''].join(' ')
    );

    const bySearch = !q || searchable.includes(q);
    const byRubro  = !filters.rubroId  || p.rubroId  === filters.rubroId;
    const byUnidad = !filters.unidadId || p.unidadId === filters.unidadId;
    const byEstado = !filters.estado
      || (filters.estado === 'Activo' && p.estadoBool)
      || (filters.estado === 'Inactivo' && !p.estadoBool);

    return bySearch && byRubro && byUnidad && byEstado;
  });
}, [products, filters]);

  const openNew = () => { setEditing(null); setModalOpen(true) }

  const onEdit = (id: number) => {
    // UIProduct -> Product (solo campos que usa el modal)
    const p = products.find(x => x.id === id)
    const asProduct: Product | null = p ? {
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      rubro: p.rubro,
      marca: p.marca,
      unidad: p.unidad,
      precioVenta: p.precioVenta,
      precioLista: p.precioLista,
      estado: p.estado,
    } : null
    setEditing(asProduct)
    setModalOpen(true)
  }

  const onDelete = (id: number) => setProducts(prev => prev.filter(p => p.id !== id))

  // 🔔 Nota: hoy el modal hace POST a /api/productos; acá seguimos actualizando la UI local como antes.
  // Si querés sincronizar 100% con DB después del POST, podés reemplazar por router.refresh() (server re-fetch).
  const onSave = (payload: Omit<Product, 'id'> & { id?: number }) => {
    setProducts(prev => {
      if (payload.id) {
        // edición local
        return prev.map(p =>
          p.id === payload.id
            ? {
                ...p,
                nombre: payload.nombre,
                descripcion: payload.descripcion,
                rubro: payload.rubro,
                marca: payload.marca,
                unidad: payload.unidad,
                precioVenta: payload.precioVenta,
                precioLista: payload.precioLista,
                estado: payload.estado,
                rubroId: rubros.find(r => r.nombre === payload.rubro)?.id ?? p.rubroId,
                unidadId: unidades.find(u => u.nombre === payload.unidad)?.id ?? p.unidadId,
                estadoBool: payload.estado === 'Activo',
              }
            : p
        )
      } else {
        // alta local
        const newId = Math.max(0, ...prev.map(p => p.id)) + 1
        return [
          ...prev,
          {
            id: newId,
            nombre: payload.nombre,
            descripcion: payload.descripcion,
            rubro: payload.rubro,
            marca: payload.marca,
            unidad: payload.unidad,
            precioVenta: payload.precioVenta,
            precioLista: payload.precioLista,
            estado: payload.estado,
            rubroId: rubros.find(r => r.nombre === payload.rubro)?.id ?? 0,
            unidadId: unidades.find(u => u.nombre === payload.unidad)?.id ?? 0,
            estadoBool: payload.estado === 'Activo',
          },
        ]
      }
    })
    setModalOpen(false)
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Productos</span>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Gestión de Productos
          </h2>
          <p className="text-gray-600 text-lg">Administra tu catálogo de productos de manera eficiente</p>
        </div>

        <button
          onClick={openNew}
          className="btn-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 text-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Stats */}
      <StatsCards products={products as unknown as Product[]} />

      {/* Filtros (con catálogos reales) */}
      <Filters
        rubros={rubros}
        unidades={unidades}
        value={filters}
        onChange={setFilters}
        onApply={() => { /* opcional; el filtrado ya es en vivo */ }}
      />

      {/* Tabla */}
      <ProductsTable
        products={filtered as unknown as Product[]}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Paginación placeholder */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-gray-600 font-medium">
          Mostrando <span className="font-bold text-primary-pink">{filtered.length}</span> de{' '}
          <span className="font-bold text-primary-pink">{products.length}</span> productos
        </p>
        <div className="flex gap-2">
          <button className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">Anterior</button>
          <button className="px-6 py-3 bg-gradient-to-r from-primary-pink to-light-pink text-white rounded-xl font-medium">1</button>
          <button className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">Siguiente</button>
        </div>
      </div>

      {/* Modal (le pasamos solo los nombres de rubros para mantener su API actual) */}
      <ProductModal
        open={modalOpen}
        product={editing}
        rubros={rubros.map(r => r.nombre)}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
      />
    </>
  )
}
