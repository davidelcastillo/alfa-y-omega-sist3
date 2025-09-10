'use client'

import { useMemo, useState, useEffect } from 'react'
import StatsCards from '@/components/depositos/StatsCards'
import Filters from '@/components/depositos/Filters'
import DepositsTable from '@/components/depositos/DepositsTable'
import DepositModal from '@/components/depositos/DepositModal'
import { depositsMock } from '@/lib/deposito/productsData'
import type { Deposito } from '@/lib/deposito/types'
import Link from 'next/link'

type FiltersState = {
  search: string
  tipo: '' | 'Principal' | 'Sucursal' | 'Temporal' | 'Tránsito'
  estado: '' | 'Activo' | 'Inactivo'
}

const DEFAULT_FILTERS: FiltersState = { search: '', tipo: '', estado: '' }
const PAGE_SIZE = 10

export default function DepositosPage() {
  const [deposits, setDeposits] = useState<Deposito[]>([])
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Deposito | null>(null)

// Cargar depósitos desde el backend
useEffect(() => {
  async function fetchDeposits() {
    try {
      const res = await fetch("/api/deposito", { cache: 'no-store' })
      const json = await res.json()

      if (!json?.ok || !Array.isArray(json.data)) {
        setDeposits([])
        return
      }

      // MODIFICAR ESTO CUANDO ESTEN LAS APIS
      const mapped: Deposito[] = json.data.map((d: any) => ({
        id: Number(d.id),
        nombre: d.nombre ?? '',
        provincia: d.provincia ?? '',          // <- aún no llega: default ''
        ciudad: d.ciudad ?? '',                // <- aún no llega: default ''
        ubicacion: d.ubicacion ?? '',
        tipo: (d.tipo ?? 'Principal') as Deposito['tipo'],
        capacidad: d.capacidad ?? null,
        itemsStock: Number(d.itemsStock ?? 0), // si no existe en API, 0
        estado: (d.estado ? 'Activo' : 'Inactivo') as 'Activo' | 'Inactivo',
        descripcion: d.descripcion ?? '',
      }))

      setDeposits(mapped)
    } catch (e) {
      console.error('Error al cargar depósitos:', e)
      setDeposits([])
    }
  }
  fetchDeposits()
}, [])

const filtered = useMemo(() => {
  const q = filters.search.toLowerCase()
  return deposits.filter(d => {
    const bySearch = !q || [d.nombre, d.ubicacion, d.ciudad, d.provincia]
      .some(s => (s ?? '').toLowerCase().includes(q))
    const byTipo   = !filters.tipo   || d.tipo === filters.tipo

    //  d.estado es 'Activo' | 'Inactivo'
    const byEstado = !filters.estado || d.estado === filters.estado

    return bySearch && byTipo && byEstado
  })
}, [deposits, filters])


  // --- Paginación ---
  const [page, setPage] = useState(1)
  useEffect(() => { setPage(1) }, [filters]) // reset al cambiar filtros
  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const start = (page - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, totalItems)
  const pageItems = filtered.slice(start, end)

  function onEdit(id: number) {
    const dep = deposits.find(d => d.id === id) ?? null
    setEditing(dep)
    setOpen(true)
  }
  function onDelete(id: number) {
    if (!confirm('¿Eliminar depósito?')) return
    setDeposits(prev => prev.filter(d => d.id !== id))
  }
  function onSave(payload: Omit<Deposito, 'id'> & { id?: number }) {
    setDeposits(prev => {
      if (payload.id) {
        return prev.map(d => (d.id === payload.id ? { ...d, ...payload } as Deposito : d))
      }
      const newId = Math.max(0, ...prev.map(d => d.id)) + 1
      return [...prev, { id: newId, ...payload } as Deposito]
    })
    setOpen(false)
    setEditing(null)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span className="text-primary-pink font-medium">Depósito</span>
      </div>

      {/* Action bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Gestión de Depósitos
          </h2>
          <p className="text-gray-600 text-lg">Administra tus depósitos y controla el stock por ubicación</p>
        </div>

        <div className="flex space-x-4">
          {/* Nuevo Depósito */}
          <button
            onClick={() => { setEditing(null); setOpen(true) }}
            className="btn-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>Nuevo Depósito</span>
          </button>

          {/* Gestionar Stock */}
          <Link
            href="/depositos/stock"
            className="bg-gradient-to-r from-primary-blue to-dark-blue text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 text-lg hover:shadow-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>Gestionar Stock</span>
          </Link>
        </div>
      </div>

      <StatsCards deposits={filtered} />

      <Filters
        value={filters}
        onChange={setFilters}
        onApply={() => { /* reactivo */ }}
      />

      <DepositsTable
        deposits={pageItems}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Footer / Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-gray-600 font-medium">
          {totalItems === 0 ? (
            <>Mostrando <span className="font-bold text-primary-pink">0</span> de <span className="font-bold text-primary-pink">0</span> depósitos</>
          ) : (
            <>Mostrando <span className="font-bold text-primary-pink">{start + 1}-{end}</span> de <span className="font-bold text-primary-pink">{totalItems}</span> depósitos</>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page <= 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700 px-2">
            Página <span className="font-semibold">{Math.min(page, totalPages)}</span> de <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page >= totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      <DepositModal
        open={open}
        deposito={editing}
        onClose={() => { setOpen(false); setEditing(null) }}
        onSave={onSave}
      />
    </main>
  )
}
