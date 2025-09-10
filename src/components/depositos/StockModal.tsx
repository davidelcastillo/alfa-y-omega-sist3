'use client'

import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { Deposito, ProductoLite } from '@/lib/deposito/types'
import type { UIStock } from '@/app/depositos/stock/page'

export default function StockModal({
  open,
  item,
  deposits,
  products,
  onClose,
  onSave,
}: {
  open: boolean
  item: UIStock | null
  deposits: Deposito[]
  products: ProductoLite[]
  onClose: () => void
  onSave: (patch: Partial<UIStock> & { id: number }) => void
}) {
  const [form, setForm] = useState({
    id: 0,
    depositId: 0,
    productId: 0,
    stockActual: 0,
    stockMinimo: 0,
    stockMaximo: 0,
  })

  useEffect(() => {
    if (item) {
      setForm({
        id: item.id,
        depositId: item.depositId,
        productId: item.productId,
        stockActual: item.stockActual,
        stockMinimo: item.stockMinimo,
        stockMaximo: item.stockMaximo,
      })
    }
  }, [item, open])

  if (!open || !item) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-blue to-dark-blue p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Ajustar Stock</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-2" aria-label="Cerrar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Depósito *"
              required
              value={form.depositId}
              onChange={(e) => setForm(f => ({ ...f, depositId: Number(e.target.value) }))}
            >
              <option value="">Seleccionar depósito</option>
              {deposits.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </Select>

            <Select
              label="Producto *"
              required
              value={form.productId}
              onChange={(e) => setForm(f => ({ ...f, productId: Number(e.target.value) }))}
            >
              <option value="">Seleccionar producto</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.descripcion}</option>)}
            </Select>

            <Input
              label="Stock Actual *"
              type="number"
              min={0}
              required
              value={form.stockActual}
              onChange={(e) => setForm(f => ({ ...f, stockActual: Number(e.target.value || 0) }))}
            />
            <Input
              label="Stock Mínimo *"
              type="number"
              min={0}
              required
              value={form.stockMinimo}
              onChange={(e) => setForm(f => ({ ...f, stockMinimo: Number(e.target.value || 0) }))}
            />
            <Input
              label="Stock Máximo *"
              type="number"
              min={0}
              required
              value={form.stockMaximo}
              onChange={(e) => setForm(f => ({ ...f, stockMaximo: Number(e.target.value || 0) }))}
            />
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onClose} className="px-8">
              Cancelar
            </Button>
            <Button type="submit" className="px-8">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
