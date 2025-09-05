'use client'

import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

type FiltersState = {
  search: string
  tipo: '' | 'Principal' | 'Sucursal' | 'Temporal' | 'Tránsito'
  estado: '' | 'Activo' | 'Inactivo'
}

const DEFAULTS: FiltersState = { search: '', tipo: '', estado: '' }

export default function Filters({
  value = DEFAULTS,
  onChange,
  onApply,
}: {
  value?: FiltersState
  onChange: (f: FiltersState) => void
  onApply?: () => void
}) {
  function set<K extends keyof FiltersState>(key: K, val: FiltersState[K]) {
    onChange({ ...value, [key]: val })
  }
  function reset() {
    onChange(DEFAULTS)
  }

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover">
      <h3 className="text-xl font-semibold text-dark-blue mb-6">Filtros de Búsqueda</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Input
          label="Buscar depósito"
          placeholder="Nombre, ubicación..."
          value={value.search}
          onChange={(e) => set('search', e.target.value)}
        />
        <Select
          label="Tipo"
          value={value.tipo}
          onChange={(e) => set('tipo', e.target.value as FiltersState['tipo'])}
        >
          <option value="">Todos los tipos</option>
          <option value="Principal">Principal</option>
          <option value="Sucursal">Sucursal</option>
          <option value="Temporal">Temporal</option>
          <option value="Tránsito">Tránsito</option>
        </Select>
        <Select
          label="Estado"
          value={value.estado}
          onChange={(e) => set('estado', e.target.value as FiltersState['estado'])}
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </Select>
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onApply}
            className="w-full bg-gradient-to-r from-primary-blue to-dark-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
