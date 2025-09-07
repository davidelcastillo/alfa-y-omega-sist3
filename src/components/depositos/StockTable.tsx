import type { UIStock } from '@/app/depositos/stock/page'

function statusClasses(status: UIStock['status']) {
  if (status === 'bajo')   return { pill: 'bg-red-100 text-red-600', value: 'text-red-600' }
  if (status === 'alto')   return { pill: 'bg-orange-100 text-orange-600', value: 'text-orange-600' }
  return { pill: 'bg-green-100 text-green-600', value: 'text-green-600' }
}

export default function StockTable({
  items,
  onEdit,
}: {
  items: UIStock[]
  onEdit: (id: number) => void
}) {
  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover">
      <div className="bg-gradient-to-r from-primary-blue to-dark-blue p-6">
        <h3 className="text-xl font-bold text-white">Inventario por Depósito</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Depósito', 'Producto', 'Stock Actual', 'Stock Mínimo', 'Stock Máximo', 'Nivel', 'Estado', 'Acciones']
                .map(h => <th key={h} className="px-4 py-4 text-left text-sm font-bold text-dark-blue">{h}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {items.map(it => {
              const cls = statusClasses(it.status)
              return (
                <tr key={it.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{it.depositNombre}</div>
                    <div className="text-xs text-gray-500">{it.depositUbicacion}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{it.productDescripcion}</td>
                  <td className={`px-4 py-3 text-sm font-bold ${cls.value}`}>{it.stockActual}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{it.stockMinimo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{it.stockMaximo}</td>
                  <td className="px-4 py-3">
                    <div className="stock-progress">
                      <div className="stock-progress-bar bg-gray-400" style={{ width: `${it.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{it.progress.toFixed(1)}%</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${cls.pill}`}>
                      {it.status === 'bajo' ? 'Stock Bajo' : it.status === 'alto' ? 'Stock Alto' : 'Stock Normal'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onEdit(it.id)}
                      className="text-primary-blue hover:text-dark-blue transition-colors p-2 rounded-lg hover:bg-light-pink"
                      aria-label="Ajustar stock"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}

            {items.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-500">Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
