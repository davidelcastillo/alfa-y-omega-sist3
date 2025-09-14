'use client'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
export type FiltersState = { name: string; code: string; status: string;
category: string }

export default function Filters({ value, onChange }: { value:
FiltersState; onChange: (v: FiltersState) => void }) {
return (
<div className="glass-effect rounded-2xl p-8 mb-8 card-hover">
<h3 className="text-xl font-semibold text-dark-blue mb-6">Filtros de
Búsqueda</h3>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div>
<label className="block text-sm font-semibold text-gray-700
mb-3">Buscar por Nombre</label>
<Input placeholder="Nombre o razón social..." value={value.name}
onChange={(e) => onChange({ ...value, name:
e.target.value.toLowerCase() })} />
</div>
<div>
<label className="block text-sm font-semibold text-gray-700
mb-3">Código de Proveedor</label>
<Input placeholder="Código..." value={value.code}
onChange={(e) => onChange({ ...value, code:
e.target.value.toLowerCase() })} />
</div>
<div>
<label className="block text-sm font-semibold text-gray-700
mb-3">Estado</label>
<Select value={value.status} onChange={(e) => onChange({ ...value,
status: e.target.value })}>
<option value="">Todos</option>
<option value="Activo">Activos</option>
<option value="Inactivo">Inactivos</option>
</Select>
</div>
<div>
<label className="block text-sm font-semibold text-gray-700
mb-3">Categoría Fiscal</label>
<Select value={value.category} onChange={(e) =>
onChange({ ...value, category: e.target.value })}>
<option value="">Todas</option>
<option value="Consumidor Final">Consumidor Final</option>
<option value="Exento">Exento</option>
<option value="Monotributista">Monotributista</option>
<option value="Responsable Inscripto">Responsable Inscripto</
option>
<option value="Exterior">Exterior</option>
</Select>
</div>
</div>
<div className="flex justify-between items-center mt-6">
<Button variant="muted" onClick={() => onChange({ name: '', code:
'', status: '', category: '' })}>Limpiar Filtros</Button>
<Button variant="primaryBlue">Buscar Proveedores</Button>
</div>
</div>
)
}
