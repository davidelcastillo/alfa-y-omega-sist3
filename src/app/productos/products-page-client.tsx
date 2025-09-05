'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import StatsCards from '@/components/productos/StatsCards'
import Filters, { type ProductFilters } from '@/components/productos/Filters'
import ProductsTable from '@/components/productos/ProductsTable'
import ProductModal from '@/components/productos/ProductModal'
import { useRouter, useSearchParams } from 'next/navigation'
import { softDeleteProducto } from '@/lib/api'

import type { UIProduct } from '@/lib/types'
import type { Catalogo } from '@/server/productos.queries'
import type { Product, SortKey, SortOrder } from '@/lib/types'

const DEFAULT_FILTERS: ProductFilters = { search: '', rubroId: '', unidadId: '', estado: '' }
const PAGE_SIZE = 10

const sortProducts = (products: UIProduct[], sortKey: SortKey, sortOrder: SortOrder) => {
  if (!sortKey || !sortOrder) return products
  return [...products].sort((a, b) => {
    const aValue = a[sortKey]
    const bValue = b[sortKey]
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    if (aValue == null) return sortOrder === 'asc' ? 1 : -1
    if (bValue == null) return sortOrder === 'asc' ? -1 : 1
    return 0
  })
}

export default function ProductsPageClient({
  initialProducts,
  rubros,
  unidades,
}: {
  initialProducts: UIProduct[]
  rubros: Catalogo[]
  unidades: Catalogo[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<UIProduct[]>(initialProducts)
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // 👉 estado de paginación
  const [page, setPage] = useState(1)

  // Sync con server cuando cambia initialProducts (después de router.refresh())
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  // --- Orden ---
  const [sortState, setSortState] = useState<{ key: SortKey; order: SortOrder }>(() => {
    const sortKey = searchParams.get('orderBy') as SortKey
    const sortOrder = searchParams.get('order') as SortOrder
    return { key: sortKey, order: sortOrder }
  })

  useEffect(() => {
    const sortKey = searchParams.get('orderBy') as SortKey
    const sortOrder = searchParams.get('order') as SortOrder
    setSortState({ key: sortKey, order: sortOrder })
  }, [searchParams])

  const handleSort = useCallback((key: SortKey) => {
    setSortState(prev => {
      let newOrder: SortOrder
      if (prev.key === key) {
        newOrder = prev.order === 'asc' ? 'desc' : (prev.order === 'desc' ? null : 'asc')
      } else {
        newOrder = 'asc'
      }
      return { key, order: newOrder }
    })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (sortState.key && sortState.order) {
      params.set('orderBy', sortState.key)
      params.set('order', sortState.order)
    } else {
      params.delete('orderBy')
      params.delete('order')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }, [sortState, router, searchParams])

  // --- Filtro + Orden ---
  const filteredAndSorted = useMemo(() => {
    const q = filters.search.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    const filtered = products.filter((p) => {
      const searchable = [p.nombre, p.marca, p.rubro, p.unidad, p.descripcion ?? '']
        .join(' ')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
      const bySearch = !q || searchable.includes(q)
      const byRubro  = !filters.rubroId  || p.rubroId  === Number(filters.rubroId)
      const byUnidad = !filters.unidadId || p.unidadId === Number(filters.unidadId)
      const byEstado = !filters.estado
        || (filters.estado === 'Activo' && p.estadoBool)
        || (filters.estado === 'Inactivo' && !p.estadoBool)
      return bySearch && byRubro && byUnidad && byEstado
    })
    return sortProducts(filtered, sortState.key, sortState.order)
  }, [products, filters, sortState])

  // 👉 resetear a la página 1 cuando cambian filtros u orden
  useEffect(() => {
    setPage(1)
  }, [filters, sortState])

  // 👉 clamp de página si el total cambia (por ejemplo al borrar)
  const totalItems = filteredAndSorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  // 👉 items de la página actual
  const start = (page - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, totalItems)
  const pageItems = filteredAndSorted.slice(start, start + PAGE_SIZE)

  // --- Acciones ---
  const openNew = () => { setEditing(null); setModalOpen(true) }

  const onEdit = (id: number) => {
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

  const onSave = async (payload: { id?: number; [key: string]: any }) => {
    try {
      const url = payload.id ? `/api/productos/${payload.id}` : '/api/productos'
      const method = payload.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? 'Error al guardar el producto')
      setModalOpen(false)
      setEditing(null)
      router.refresh()
    } catch (e: any) {
      alert(e?.message ?? 'Hubo un error al guardar el producto.')
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm('¿Desea dejar inactivo este producto?')) return
    try {
      setDeletingId(id)
      await softDeleteProducto(id) // PUT /api/productos/:id/eliminar
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, estado: 'Inactivo', estadoBool: false } : p))
      )
      // router.refresh()  // si preferís revalidar desde el server
    } catch (e: any) {
      alert(e?.message ?? 'No se pudo eliminar')
    } finally {
      setDeletingId(null)
    }
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

      {/* Filtros */}
      <Filters
        rubros={rubros}
        unidades={unidades}
        value={filters}
        onChange={setFilters}
        onApply={() => {}}
      />

      {/* Tabla (con paginado) */}
      <ProductsTable
        products={pageItems}
        onEdit={onEdit}
        onDelete={onDelete}
        onSort={handleSort}
        sortState={sortState}
      />

      {/* Footer / Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-gray-600 font-medium">
          {totalItems === 0
            ? <>Mostrando <span className="font-bold text-primary-pink">0</span> de <span className="font-bold text-primary-pink">0</span> productos</>
            : <>Mostrando <span className="font-bold text-primary-pink">{start + 1}-{end}</span> de <span className="font-bold text-primary-pink">{totalItems}</span> productos</>}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page <= 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700 px-2">
            Página <span className="font-semibold">{Math.min(page, totalPages)}</span> de <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page >= totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        open={modalOpen}
        product={editing}
        rubros={rubros.map(r => r.nombre)}
        unidades={unidades.map(u => u.nombre)}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={onSave}
      />
    </>
  )
}
