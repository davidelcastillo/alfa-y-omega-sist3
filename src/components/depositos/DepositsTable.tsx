'use client'

import Link from 'next/link'
import type { Deposito } from '@/lib/deposito/types'
import Badge from '@/components/ui/Badge'

function typeColor(tipo: Deposito['tipo']) {
  const map: Record<Deposito['tipo'], string> = {
    Principal: 'bg-purple-100 text-purple-800',
    Sucursal:  'bg-blue-100 text-blue-800',
    Temporal:  'bg-yellow-100 text-yellow-800',
    'Tránsito':'bg-gray-100 text-gray-800',
  }
  return map[tipo]
}

export default function DepositsTable({
  deposits,
  onEdit,
  onDelete,
}: {
  deposits: Deposito[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover">
      <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
        <h3 className="text-xl font-bold text-white">Lista de Depósitos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['ID','Nombre','Provincia','Ciudad','Ubicación','Tipo','Capacidad','Items Stock','Estado','Acciones']
                .map(h => <th key={h} className="px-6 py-4 text-left text-sm font-bold text-dark-blue">{h}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {deposits.map(d => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-light-pink hover:to-transparent transition-all duration-300">
                <td className="px-6 py-4 text-sm font-bold text-primary-pink">#{d.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{d.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.provincia || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.ciudad || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.ubicacion}</td>
                <td className="px-6 py-4">
                  <Badge className={typeColor(d.tipo)}>{d.tipo}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.capacidad ? `${d.capacidad.toFixed(2)} m³` : 'N/A'}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary-blue">{d.itemsStock}</td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-2 text-xs font-bold rounded-full text-white ${d.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>{d.estado}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    {/* Editar */}
                    <button
                      onClick={() => onEdit(d.id)}
                      className="text-primary-blue hover:text-dark-blue transition-colors p-2 rounded-lg hover:bg-light-pink"
                      aria-label={`Editar ${d.nombre}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>

                    {/* Stock (link con el depósito preseleccionado) */}
                    <Link
                      href={`/depositos/stock?depositId=${d.id}`}
                      className="text-primary-blue hover:text-dark-blue transition-colors p-2 rounded-lg hover:bg-light-pink"
                      aria-label={`Gestionar stock de ${d.nombre}`}
                    >
                      {/* Icono de barras (mismo usado en “Gestionar Stock”) */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </Link>

                    {/* Eliminar */}
                    <button
                      onClick={() => onDelete(d.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                      aria-label={`Eliminar ${d.nombre}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {deposits.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-gray-500">Sin resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
