'use client'
import { useMemo, useState } from 'react'
import StatsCards from '@/components/sections/StatsCards'
import Filters, { type FiltersState } from '@/components/sections/Filters'
import ProductsTable from '@/components/sections/ProductsTable'
import ProductModal from '@/components/sections/ProductModal'
import { productsData, rubros, estados } from '@/lib/productsData'
import { Product } from '@/lib/types'

export default function Page() {
const [products, setProducts] = useState<Product[]>(productsData)
const [filters, setFilters] = useState<FiltersState>({ search: '', rubro: '', estado: '' })
const [modalOpen, setModalOpen] = useState(false)
const [editing, setEditing] = useState<Product | null>(null)

const filtered = useMemo(() => {
return products.filter((p) => {
const matchesSearch = !filters.search || (p.descripcion + ' ' + p.marca).toLowerCase().includes(filters.search.toLowerCase())
const matchesRubro = !filters.rubro || p.rubro === filters.rubro
const matchesEstado = !filters.estado || p.estado === filters.estado
return matchesSearch && matchesRubro && matchesEstado
})
}, [products, filters])
const openNew = () => { setEditing(null); setModalOpen(true) }
const onEdit = (id: number) => { const p = products.find((x) => x.id === id) || null; setEditing(p); setModalOpen(true) }
const onDelete = (id: number) => setProducts((prev) => prev.filter((p) => p.id !== id))


const onSave = (payload: Omit<Product, 'id'> & { id?: number }) => {
setProducts((prev) => {
if (payload.id) return prev.map((p) => (p.id === payload.id ? { ...p, ...payload } as Product : p))
const newId = Math.max(0, ...prev.map((p) => p.id)) + 1
return [...prev, { id: newId, ...payload } as Product]
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

<StatsCards products={products} />

<Filters
state={filters}
rubros={rubros as unknown as string[]}
estados={estados as unknown as string[]}
onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
onApply={() => { /* sin-op; el filtrado ya es reactivo */ }}
/>

<ProductsTable products={filtered} onEdit={onEdit} onDelete={onDelete} />


{/* Paginación placeholder */}
<div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
<p className="text-gray-600 font-medium">
Mostrando <span className="font-bold text-primary-pink">{filtered.length}</span> de <span className="font-bold text-primary-pink">{products.length}</span> productos
</p>
<div className="flex gap-2">
<button className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">Anterior</button>
<button className="px-6 py-3 bg-gradient-to-r from-primary-pink to-light-pink text-white rounded-xl font-medium">1</button>
<button className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">Siguiente</button>
</div>
</div>


<ProductModal open={modalOpen} product={editing} rubros={rubros as unknown as string[]} onClose={() => setModalOpen(false)} onSave={onSave} />
</>
)
}