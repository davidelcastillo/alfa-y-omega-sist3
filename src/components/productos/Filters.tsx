'use client'
import { useEffect, useState, type ChangeEvent } from 'react'

type Catalogo = { id: number; nombre: string }
export type ProductFilters = {
  search: string
  rubroId: number | ''
  unidadId: number | ''
  estado: 'Activo' | 'Inactivo' | ''
}

const DEFAULTS: ProductFilters = { search: '', rubroId: '', unidadId: '', estado: '' }

// Agregamos nuevos props a la interfaz
type Props = {
  rubros: Catalogo[]
  unidades: Catalogo[]
  value?: ProductFilters
  onChange: (f: ProductFilters) => void
  onApply?: () => void
  // Nuevos props para el agrupamiento
  onGroupByChange: (by: 'rubro' | 'marca' | 'unidad' | 'estado' | null) => void
  groupByValue: string | null
}

export default function Filters({
  rubros,
  unidades,
  value = DEFAULTS,
  onChange,
  onApply,
  onGroupByChange,
  groupByValue,
}: Props) {
  const [filters, setFilters] = useState<ProductFilters>(value)

  useEffect(() => { setFilters(value) }, [value])

  function set<K extends keyof ProductFilters>(key: K, val: ProductFilters[K]) {
    const next = { ...filters, [key]: val }
    setFilters(next)
    onChange(next)
  }

  function reset() {
    setFilters(DEFAULTS)
    onChange(DEFAULTS)
  }

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover">
      <h3 className="text-xl font-semibold text-dark-blue mb-6">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Buscar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Buscar producto</label>
          <input
            type="text"
            placeholder="Producto/Descripción/Marca"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
          />
        </div>

        {/* Rubro */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Rubro</label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all"
            value={filters.rubroId}
            onChange={(e) => set('rubroId', e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Todos los rubros</option>
            {rubros.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        {/* Unidad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Unidad</label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all"
            value={filters.unidadId}
            onChange={(e) => set('unidadId', e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Todas</option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Estado</label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all"
            value={filters.estado}
            onChange={(e) => set('estado', e.target.value as ProductFilters['estado'])}
          >
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      
      {/* Botones de Agrupamiento - ¡NUEVO! */}
      

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-6 py-3 bg-gradient-to-r from-primary-blue to-dark-blue text-white rounded-xl font-medium"
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}