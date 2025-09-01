'use client'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

export type FiltersState = {
  search: string
  rubro: string
  estado: string
}

export default function Filters({ state, rubros, estados, onChange, onApply }: {
  state: FiltersState
  rubros: readonly string[]
  estados: readonly string[]
  onChange: (patch: Partial<FiltersState>) => void
  onApply: () => void
}) {  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover">
      <h3 className="text-xl font-semibold text-dark-blue mb-6">Filtros de Búsqueda</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Input
          label="Buscar producto"
          placeholder="Descripción, marca..."
          value={state.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
        <Select label="Rubro" value={state.rubro} onChange={(e) => onChange({ rubro: e.target.value })}>
          <option value="">Todos los rubros</option>
          {rubros.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
        <Select label="Estado" value={state.estado} onChange={(e) => onChange({ estado: e.target.value })}>
          <option value="">Todos</option>
          {estados.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <div className="flex items-end">
          <Button onClick={onApply} className="w-full bg-gradient-to-r from-primary-blue to-dark-blue text-white">Filtrar Resultados</Button>
        </div>
      </div>
    </div>
  )
}