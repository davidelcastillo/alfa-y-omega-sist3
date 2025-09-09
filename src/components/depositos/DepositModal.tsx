'use client'

import { useEffect, useState } from 'react'
import type { Deposito, Estado, TipoDeposito } from '@/lib/deposito/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function DepositModal({
  open,
  deposito,
  onClose,
  onSave,
}: {
  open: boolean
  deposito?: Deposito | null
  onClose: () => void
  onSave: (payload: Omit<Deposito, 'id'> & { id?: number }) => void
}) {
  const [form, setForm] = useState<Omit<Deposito, 'id'>>({
    nombre: '',
    provincia: '',
    ciudad: '',
    ubicacion: '',
    tipo: 'Principal',
    capacidad: 0,
    itemsStock: 0,
    estado: 'Activo',
    descripcion: '',
  })

  useEffect(() => {
    if (deposito) {
      const { id, ...rest } = deposito
      setForm(rest)
    } else {
      setForm({
        nombre: '',
        provincia: '',
        ciudad: '',
        ubicacion: '',
        tipo: 'Principal',
        capacidad: 0,
        itemsStock: 0,
        estado: 'Activo',
        descripcion: '',
      })
    }
  }, [deposito, open])

  function set<K extends keyof Omit<Deposito, 'id'>>(key: K, val: Omit<Deposito, 'id'>[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(deposito ? { ...form, id: deposito.id } : form)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">{deposito ? 'Editar Depósito' : 'Nuevo Depósito'}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-2" aria-label="Cerrar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nombre *" required value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
            <Select label="Tipo *" value={form.tipo} onChange={(e) => set('tipo', e.target.value as TipoDeposito)}>
              <option value="Principal">Principal</option>
              <option value="Sucursal">Sucursal</option>
              <option value="Temporal">Temporal</option>
              <option value="Tránsito">Tránsito</option>
            </Select>
            <Input label="Provincia *" required value={form.provincia} onChange={(e) => set('provincia', e.target.value)} /> 
            <Input label="Ciudad *" required value={form.ciudad} onChange={(e) => set('ciudad', e.target.value)} />
            <Input label="Ubicación *" required className="md:col-span-2" value={form.ubicacion} onChange={(e) => set('ubicacion', e.target.value)} />
            <Input
              label="Capacidad (m³)"
              type="number"
              min={0}
              step="0.01"
              value={form.capacidad ?? 0}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value >= 0) {
                  set('capacidad', value)
                }
              }}
            />

            <Select label="Estado" value={form.estado} onChange={(e) => set('estado', e.target.value as Estado)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Select>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onClose} className="px-8">Cancelar</Button>
            <Button type="submit" className="px-8">Guardar Depósito</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
