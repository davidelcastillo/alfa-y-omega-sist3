'use client'
import type { UIProduct } from '@/lib/types'

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
}: {
  products: UIProduct[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) {
return (
<div className="glass-effect rounded-2xl overflow-hidden card-hover">
<div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
<h3 className="text-xl font-bold text-white">Lista de Productos</h3>
</div>
<div className="overflow-x-auto">
<table className="w-full">
<thead className="bg-gray-50">
<tr>
{['ID','Nombre','Rubro','Marca','Unidad','Precio Venta','Precio Lista','Estado','Acciones'].map((h) => (
<th key={h} className="px-6 py-4 text-left text-sm font-bold text-dark-blue">{h}</th>
))}
</tr>
</thead>
<tbody>
{products.map((p) => (
<tr key={p.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-light-pink hover:to-transparent transition-all duration-300">
<td className="px-6 py-4 text-sm font-bold text-primary-pink">#{p.id}</td>
<td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.nombre}</td>
<td className="px-6 py-4 text-sm text-gray-600">{p.rubro}</td>
<td className="px-6 py-4 text-sm text-gray-600">{p.marca}</td>
<td className="px-6 py-4 text-sm text-gray-600">{p.unidad}</td>
<td className="px-6 py-4 text-sm font-bold text-green-600">${p.precioVenta.toFixed(2)}</td>
<td className="px-6 py-4 text-sm text-gray-600">${p.precioLista.toFixed(2)}</td>
<td className="px-6 py-4">
<span className={`px-4 py-2 text-xs font-bold rounded-full text-white ${p.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>{p.estado}</span>
</td>
<td className="px-6 py-4">
<div className="flex space-x-3">
<button onClick={() => onEdit(p.id)} className="text-primary-blue hover:text-dark-blue transition-colors p-2 rounded-lg hover:bg-light-pink" aria-label={`Editar ${p.nombre}`}>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
</button>
<button onClick={() => onDelete(p.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50" aria-label={`Eliminar ${p.nombre}`}>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
</button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)
}