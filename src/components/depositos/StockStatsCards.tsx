import type { Deposito } from '@/lib/deposito/types'
import type { UIStock } from '@/app/depositos/stock/page.tsx' // si podés, mové estos types a /lib para evitar importar desde pages

// Opcional: si este comp se usa dentro de una Client Page, ya se renderiza en el cliente.
// Si lo usás desde Server, agregá 'use client' arriba para evitar issues con toLocaleString.

function Icon({ name }: { name: 'building' | 'check' | 'bars' | 'capacity' }) {
  const cls = 'w-6 h-6 text-white'
  switch (name) {
    case 'building':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      )
    case 'check':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    case 'bars':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      )
    case 'capacity':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      )
  }
}

export default function StockStatsCards({
  stock,
  deposits,
}: {
  stock: UIStock[]
  deposits: Deposito[]
}) {
  const totalItems = stock.reduce((s, it) => s + Number(it?.stockActual ?? 0), 0)
  const stockBajo   = stock.filter(s => s.status === 'bajo').length
  const stockAlto   = stock.filter(s => s.status === 'alto').length
  const stockNormal = stock.filter(s => s.status === 'normal').length
  const totalCapacity = deposits.reduce((acc, d) => acc + (Number(d.capacidad) || 0), 0)

  const Card = ({
    title,
    value,
    accent,
    icon,
    iconBg,
  }: {
    title: string
    value: string | number
    accent: string
    icon: 'building' | 'check' | 'bars' | 'capacity'
    iconBg: string // e.g. 'from-primary-pink to-light-pink'
  }) => (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${accent}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon name={icon} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card
        title="Total Items"
        value={totalItems.toLocaleString()}
        accent="text-dark-blue"
        icon="bars"
        iconBg="from-primary-blue to-dark-blue"
      />
      <Card
        title="Stock Bajo"
        value={stockBajo}
        accent="text-red-500"
        icon="building" // si preferís otro para 'bajo', decime y lo cambio
        iconBg="from-primary-pink to-light-pink"
      />
      <Card
        title="Stock Alto"
        value={stockAlto}
        accent="text-orange-500"
        icon="bars"
        iconBg="from-primary-blue to-dark-blue"
      />
      <Card
        title="Stock Normal"
        value={stockNormal}
        accent="text-green-600"
        icon="check"
        iconBg="from-green-400 to-green-600"
      />
      <Card
        title="Capacidad Total"
        value={`${totalCapacity.toLocaleString()} m³`}
        accent="text-primary-pink"
        icon="capacity"
        iconBg="from-orange-400 to-orange-600"
      />
    </div>
  )
}
