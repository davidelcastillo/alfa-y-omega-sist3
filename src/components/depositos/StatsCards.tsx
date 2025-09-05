import type { Deposito } from '@/lib/deposito/types'

export default function StatsCards({ deposits }: { deposits: Deposito[] }) {
  const total = deposits.length
  const activos = deposits.filter(d => d.estado === 'Activo').length
  const items = deposits.reduce((s, d) => s + d.itemsStock, 0)
  const capacidad = deposits.reduce((s, d) => s + (d.capacidad || 0), 0)

  const Card = ({ title, value, accent }: { title: string; value: string | number; accent: string }) => (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${accent}`}>{value}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-pink to-light-pink rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card title="Total Depósitos"   value={total}           accent="text-dark-blue" />
      <Card title="Depósitos Activos" value={activos}        accent="text-green-600" />
      <Card title="Total Items Stock" value={items.toLocaleString()} accent="text-primary-blue" />
      <Card title="Capacidad Total"   value={`${capacidad.toLocaleString()} m³`} accent="text-orange-500" />
    </div>
  )
}
