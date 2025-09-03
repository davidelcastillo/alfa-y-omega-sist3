import type { Deposito } from '@/lib/deposito/types'
import type { UIStock, StockStatus } from '@/app/depositos/stock/page.tsx' //agregue .tsx

export default function StockStatsCards({
  stock,
  deposits,
}: {
  stock: UIStock[]
  deposits: Deposito[]
}) {
  const sum = (a: number, b: number) => a + b
  const totalItems = stock.map(s => s.stockActual).reduce(sum, 0)
  const stockBajo   = stock.filter(s => s.status === 'bajo').length
  const stockAlto   = stock.filter(s => s.status === 'alto').length
  const stockNormal = stock.filter(s => s.status === 'normal').length
  const totalCapacity = deposits.reduce((acc, d) => acc + (d.capacidad || 0), 0)

  const Card = ({ title, value, accent }: { title: string; value: string | number; accent: string }) => (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${accent}`}>{value}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-dark-blue rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card title="Total Items"   value={totalItems.toLocaleString()} accent="text-dark-blue" />
      <Card title="Stock Bajo"    value={stockBajo}   accent="text-red-500" />
      <Card title="Stock Alto"    value={stockAlto}   accent="text-orange-500" />
      <Card title="Stock Normal"  value={stockNormal} accent="text-green-600" />
      <Card title="Capacidad Total" value={`${totalCapacity.toLocaleString()} m³`} accent="text-primary-pink" />
    </div>
  )
}
