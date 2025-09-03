'use client'

import { useEffect, useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import type { Deposito, ProductoLite } from '@/lib/deposito/types'

export type StockFiltersState = {
  depositId: number | ''
  productQuery: string
  status: '' | 'bajo' | 'normal' | 'alto'
}

const DEFAULTS: StockFiltersState = { depositId: '', productQuery: '', status: '' }

export default function StockFilters({
  deposits,
  products,
  value = DEFAULTS,
  onChange,
  onApply,
}: {
  deposits: Deposito[]
  products: ProductoLite[]
  value?: StockFiltersState
  onChange: (f: StockFiltersState) => void
  onApply?: () => void
}) {
  const [local, setLocal] = useState<StockFiltersState>(value)
  const [openSug, setOpenSug] = useState(false)

  useEffect(() => { setLocal(value) }, [value])

  function set<K extends keyof StockFiltersState>(key: K, val: StockFiltersState[K]) {
    const next = { ...local, [key]: val }
    setLocal(next)
    onChange(next)
  }

  function reset() {
    setLocal(DEFAULTS)
    onChange(DEFAULTS)
    setOpenSug(false)
  }

  const suggestions = useMemo(() => {
    const q = local.productQuery.trim().toLowerCase()
    if (!q) return []
    return products.filter(p => p.descripcion.toLowerCase().includes(q)).slice(0, 6)
  }, [local.productQuery, products])

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover">
      <h3 className="text-xl font-semibold text-dark-blue mb-6">Filtros de Stock</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Depósito */}
        <Select
          label="Depósito"
          value={local.depositId}
          onChange={(e) => set('depositId', e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Todos los depósitos</option>
          {deposits.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
        </Select>

        {/* Producto (con sugerencias) */}
        <div className="relative">
          <Input
            label="Buscar producto"
            placeholder="Nombre del producto..."
            value={local.productQuery}
            onChange={(e) => { set('productQuery', e.target.value); setOpenSug(true) }}
            onFocus={() => setOpenSug(true)}
            onBlur={() => setTimeout(() => setOpenSug(false), 150)}
          />
          {openSug && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-light-pink border-b last:border-b-0 border-gray-100"
                  onClick={() => set('productQuery', s.descripcion)}
                >
                  <div className="text-sm font-semibold text-gray-900">{s.descripcion}</div>
                  <div className="text-xs text-gray-500">Precio: ${s.precioVenta}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Estado Stock */}
        <Select
          label="Estado Stock"
          value={local.status}
          onChange={(e) => set('status', e.target.value as StockFiltersState['status'])}
        >
          <option value="">Todos</option>
          <option value="bajo">Stock Bajo</option>
          <option value="normal">Stock Normal</option>
          <option value="alto">Stock Alto</option>
        </Select>

        {/* Botones */}
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onApply}
            className="w-full bg-gradient-to-r from-primary-blue to-dark-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
