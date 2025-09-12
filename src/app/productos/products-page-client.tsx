'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import StatsCards from '@/components/productos/StatsCards'
import Filters, { type ProductFilters } from '@/components/productos/Filters'
import ProductsTable from '@/components/productos/ProductsTable'
import ProductModal from '@/components/productos/ProductModal'
import { useRouter, useSearchParams } from 'next/navigation'
import { softDeleteProducto } from '@/lib/api'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

import type { UIProduct } from '@/lib/types'
import type { Catalogo } from '@/server/productos.queries'

/** Tipos locales (no creamos ni tocamos otros archivos) */
type SortKey = keyof UIProduct
type SortOrder = 'asc' | 'desc' | null
type GroupBy = 'rubro' | 'marca' | 'unidad' | 'estado' | null

const DEFAULT_FILTERS: ProductFilters = { search: '', rubroId: '', unidadId: '', estado: '' }
const PAGE_SIZE = 10

const sortProducts = (products: UIProduct[], sortKey: SortKey | null, sortOrder: SortOrder) => {
  if (!sortKey || !sortOrder) return products
  return [...products].sort((a, b) => {
    const aValue = a[sortKey] as unknown
    const bValue = b[sortKey] as unknown

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
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

  // modal alta/edición
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UIProduct | null>(null)

  // confirmación de borrado
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [modalId, setModalId] = useState<number | null>(null)

  // confirmación de edición
  const [showConfirmEdit, setShowConfirmEdit] = useState(false)
  const [productToEdit, setProductToEdit] = useState<UIProduct | null>(null)

  // agrupamiento (requerido por <Filters/>)
  const [groupBy, setGroupBy] = useState<GroupBy>(null)

  // paginación
  const [page, setPage] = useState(1)

  // Sync con server cuando cambia initialProducts
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  /** Ordenamiento via querystring */
  const [sortState, setSortState] = useState<{ key: SortKey | null; order: SortOrder }>(() => {
    const sortKey = (searchParams.get('orderBy') as SortKey) ?? null
    const sortOrder = (searchParams.get('order') as SortOrder) ?? null
    return { key: sortKey, order: sortOrder }
  })

  useEffect(() => {
    const sortKey = (searchParams.get('orderBy') as SortKey) ?? null
    const sortOrder = (searchParams.get('order') as SortOrder) ?? null
    setSortState({ key: sortKey, order: sortOrder })
  }, [searchParams])

  const handleSort = useCallback((key: SortKey) => {
    setSortState(prev => {
      let newOrder: SortOrder
      if (prev.key === key) newOrder = prev.order === 'asc' ? 'desc' : prev.order === 'desc' ? null : 'asc'
      else newOrder = 'asc'
      return { key, order: newOrder }
    })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (sortState.key && sortState.order) {
      params.set('orderBy', String(sortState.key))
      params.set('order', sortState.order)
    } else {
      params.delete('orderBy')
      params.delete('order')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }, [sortState, router, searchParams])

  /** Filtrado + orden */
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

  // paginación
  useEffect(() => { setPage(1) }, [filters, sortState])
  const totalItems = filteredAndSorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])

  const start = (page - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, totalItems)
  const pageItems = filteredAndSorted.slice(start, end)

  /** Acciones */
  const openNew = () => { setEditing(null); setModalOpen(true) }

  const onEdit = (id: number) => {
    const p = products.find(x => x.id === id)
    if (p) { setProductToEdit(p); setShowConfirmEdit(true) }
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
      console.error('Error al guardar el producto:', e)
      alert(e?.message ?? 'Hubo un error al guardar el producto.')
    }
  }

  const confirmarEliminacion = async () => {
    if (modalId === null) return
    try {
      setDeletingId(modalId)
      await softDeleteProducto(modalId)
      setProducts(prev =>
        prev.map(p => (p.id === modalId ? { ...p, estado: 'Inactivo', estadoBool: false } : p))
      )
    } catch (e: any) {
      alert(e?.message ?? 'No se pudo eliminar')
    } finally {
      setDeletingId(null)
      setModalId(null)
    }
  }

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
    {/*<>*/}

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

      {/* Stats (StatsCards hoy espera Product[]; casteamos para no tocar ese archivo) */}
      <StatsCards products={products as any} />

      {/* Filtros */}
      <Filters
        rubros={rubros}
        unidades={unidades}
        value={filters}
        onChange={setFilters}
        onApply={() => {}}
        groupByValue={groupBy}
        onGroupByChange={setGroupBy as (by: 'rubro' | 'marca' | 'unidad' | 'estado' | null) => void}
      />

      {/* Tabla (casteos para no depender de tipos externos inexistentes) */}
      <ProductsTable
        products={pageItems}
        onEdit={onEdit}
        onDelete={(id) => setModalId(id)}
        onSort={handleSort as any}
        sortState={sortState as any}
      />

      {/* Modal confirmación eliminar */}
      <AlertDialog open={modalId !== null} onOpenChange={(open) => { if (!open) setModalId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar acción?</AlertDialogTitle>
            <AlertDialogDescription>¿Está seguro que desea dejar inactivo este producto?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarEliminacion}
              className="px-6 py-3 bg-gradient-to-r from-primary-blue to-dark-blue text-white rounded-xl font-medium"
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal confirmación edición */}
      <AlertDialog open={showConfirmEdit} onOpenChange={setShowConfirmEdit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Editar Producto?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas editar este producto? Se abrirá el formulario con sus datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToEdit) {
                  setEditing(productToEdit)
                  setModalOpen(true)
                }
                setShowConfirmEdit(false)
              }}
              className="px-6 py-3 bg-gradient-to-r from-primary-blue to-dark-blue text-white rounded-xl font-medium"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer / Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-gray-600 font-medium">
          {totalItems === 0 ? (
            <>Mostrando <span className="font-bold text-primary-pink">0</span> de <span className="font-bold text-primary-pink">0</span> productos</>
          ) : (
            <>Mostrando <span className="font-bold text-primary-pink">{start + 1}-{end}</span> de <span className="font-bold text-primary-pink">{totalItems}</span> productos</>
          )}
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

      {/* Modal Alta/Edición */}
      <ProductModal
        open={modalOpen}
        product={editing as any}
        rubros={rubros.map(r => r.nombre)}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={onSave}
      />
    {/*</>*/}
    </main>
  )
}