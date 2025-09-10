'use client'

import type { Deposito } from '@/lib/deposito/types'

// Hacemos el prop tolerante: si stock viene undefined, usamos []
type StockForStats = { stockActual?: number | null }

export default function StockStatsCards({
  stock = [],
  deposits = [],
}: {
  stock?: StockForStats[]
  deposits?: (Deposito & { capacidad?: number | null })[]
}) {
  const total = deposits.length
  const activos = deposits.filter((d) => d?.estado === 'Activo').length
  //const items = stock.reduce((s, d) => s + Number(d?.stockActual ?? 0), 0)
  const items = deposits.reduce((s, d) => s + Number((d as any)?.itemsStock ?? 0), 0)

  const capacidad = deposits.reduce((s, d) => s + Number((d as any)?.capacidad ?? 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Depósitos */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Depósitos</p>
            <p className="text-3xl font-bold text-dark-blue">{total}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-pink to-light-pink rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Depósitos Activos */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Depósitos Activos</p>
            <p className="text-3xl font-bold text-green-600">{activos}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Total Items Stock */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Items Stock</p>
            <p className="text-3xl font-bold text-primary-blue">{items.toLocaleString()}</p>  
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-dark-blue rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Capacidad Total */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Capacidad Total</p>
            <p className="text-3xl font-bold text-orange-500">{capacidad.toLocaleString()} m³</p> {/*Esto causa un problema pero lo arreglo (Luis) cuando se conecte con datos de la base*/}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
