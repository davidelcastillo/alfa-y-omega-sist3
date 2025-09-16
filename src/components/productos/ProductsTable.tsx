'use client'
import type { UIProduct, GroupedData } from '@/lib/types'
import type { SortKey, SortOrder } from '@/lib/types'
import { SquarePen } from 'lucide-react'
import { Trash2 } from 'lucide-react'

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onSort,
  sortState,
}: {
  products: UIProduct[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onSort: (key: SortKey) => void
  sortState: { key: SortKey; order: SortOrder }
}) {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'rubro', label: 'Rubro' },
    { key: 'marca', label: 'Marca' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'estado', label: 'Estado' },
    { key: null, label: 'Acciones' },
  ]

  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover">
      <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
        <h3 className="text-xl font-bold text-white">Lista de Productos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key || h.label}
                  onClick={() => h.key && onSort(h.key as SortKey)}
                  className={`px-6 py-4 text-left text-sm font-bold text-dark-blue ${h.key ? 'cursor-pointer select-none' : ''}`}
                >
                  <div className="flex items-center">
                    {h.label}
                    {h.key && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 transition-transform duration-200 ${sortState.key === h.key && sortState.order === 'asc' ? 'rotate-180 text-black' : 'text-black'}`}
                      >
                        <path d="M7 14.5l5-5 5 5" />
                      </svg>
                    )}
                  </div>
                </th>
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

                <td className="px-6 py-4">
                  <span className={`px-4 py-2 text-xs font-bold rounded-full text-white ${p.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    {/* Icono de Lápiz para editar */}
                    <button onClick={() => onEdit(p.id)} className="text-primary-blue hover:text-dark-blue transition-colors p-2 rounded-lg hover:bg-light-pink">
                      <SquarePen className="w-6 h-6" aria-hidden />
                    </button>
                    {/* Icono de Tacho de basura para eliminar */}
                    <button onClick={() => onDelete(p.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2  className="w-6 h-6" aria-hidden />
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