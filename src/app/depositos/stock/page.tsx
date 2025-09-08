'use client'

import { useMemo, useState } from 'react'
import { depositsMock, productsLiteMock, stockItemsMock } from '@/lib/deposito/productsData'
import type { Deposito, ProductoLite } from '@/lib/deposito/types'
import StockStatsCards from '@/components/depositos/StockStatsCards'
import StockFilters, { type StockFiltersState } from '@/components/depositos/StockFilters'
import StockTable from '@/components/depositos/StockTable'
import StockModal from '@/components/depositos/StockModal'
import Link from 'next/link'


export type StockStatus = 'bajo' | 'normal' | 'alto'

export type UIStock = {
  id: number
  depositId: number
  productId: number
  depositNombre: string
  depositUbicacion: string
  productDescripcion: string
  stockActual: number
  stockMinimo: number
  stockMaximo: number
  status: StockStatus
  progress: number // 0..100
}

function statusOf(item: { stockActual: number; stockMinimo: number; stockMaximo: number }): StockStatus {
  if (item.stockActual <= item.stockMinimo) return 'bajo'
  if (item.stockActual >= item.stockMaximo) return 'alto'
  return 'normal'
}

function toUI(
  deposits: Deposito[],
  products: ProductoLite[],
  items = stockItemsMock
): UIStock[] {
  const depMap = new Map(deposits.map(d => [d.id, d]))
  const prodMap = new Map(products.map(p => [p.id, p]))
  return items.map(s => {
    const dep = depMap.get(s.depositId)
    const prod = prodMap.get(s.productId)
    const progress = s.stockMaximo > 0 ? Math.min((s.stockActual / s.stockMaximo) * 100, 100) : 0
    return {
      id: s.id,
      depositId: s.depositId,
      productId: s.productId,
      depositNombre: dep?.nombre ?? 'N/D',
      depositUbicacion: dep?.ubicacion ?? '',
      productDescripcion: prod?.descripcion ?? 'N/D',
      stockActual: s.stockActual,
      stockMinimo: s.stockMinimo,
      stockMaximo: s.stockMaximo,
      status: statusOf(s),
      progress,
    }
  })
}

const DEFAULT_FILTERS: StockFiltersState = { depositId: '', productQuery: '', status: '' }

export default function StockPage() {
  const [deposits, setDeposits] = useState(depositsMock)
  const [products] = useState(productsLiteMock)
  const [stock] = useState(() => toUI(deposits, products))
  const [filters, setFilters] = useState<StockFiltersState>(DEFAULT_FILTERS)

  // Modal edición/ajuste
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const byDeposit = (s: UIStock) => !filters.depositId || s.depositId === filters.depositId
    const q = filters.productQuery.trim().toLowerCase()
    const byProduct = (s: UIStock) => !q || s.productDescripcion.toLowerCase().includes(q)
    const byStatus = (s: UIStock) => !filters.status || s.status === filters.status
    return stock.filter(s => byDeposit(s) && byProduct(s) && byStatus(s))
  }, [stock, filters])

  // para stats: capacidad total de depósitos involucrados en los resultados
  const involvedDepositIds = useMemo(
    () => Array.from(new Set(filtered.map(r => r.depositId))),
    [filtered]
  )
  const involvedDeposits = useMemo(
    () => deposits.filter(d => involvedDepositIds.includes(d.id)),
    [deposits, involvedDepositIds]
  )

  // acciones tabla
  const onEdit = (id: number) => { setEditingId(id); setOpen(true) }
  const onSave = (patch: Partial<UIStock> & { id: number }) => {
    // Base demo: solo actualiza UI local en memoria
    // (Si después querés llevarlo a DB, acá va el fetch a tu API y un refresh de datos)
    const idx = stock.findIndex(s => s.id === patch.id)
    if (idx >= 0) {
      const current = stock[idx]
      const next = {
        ...current,
        ...patch,
      }
      // sincronizar status y progress si cambió algún valor
      next.status = statusOf(next)
      next.progress = next.stockMaximo > 0 ? Math.min((next.stockActual / next.stockMaximo) * 100, 100) : 0
      stock[idx] = next
    }
    setOpen(false)
    setEditingId(null)
  }

  const editing = editingId ? filtered.find(x => x.id === editingId) ?? null : null

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 screen-transition">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span>Depósito</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Stock por Depósito</span>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Gestión de Stock
          </h2>
          <p className="text-gray-600 text-lg">Control completo del inventario por depósito</p>
        </div>

        <div className="flex space-x-4">
          <Link
            href="/depositos"
            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 text-lg hover:shadow-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Volver a Depósitos</span>
          </Link>
        </div>
      </div>


      {/* Stats */}
      <StockStatsCards stock={filtered} deposits={involvedDeposits} />
      

      {/* Filtros */}
      <StockFilters
        deposits={deposits}
        products={products}
        value={filters}
        onChange={setFilters}
        onApply={() => { /* opcional: ya filtra en vivo */ }}
      />

      {/* Tabla */}
      <StockTable items={filtered} onEdit={onEdit} />

      {/* Modal edición */}
      <StockModal
        open={open}
        item={editing}
        deposits={deposits}
        products={products}
        onClose={() => { setOpen(false); setEditingId(null) }}
        onSave={onSave}
      />
    </main>
  )
}
