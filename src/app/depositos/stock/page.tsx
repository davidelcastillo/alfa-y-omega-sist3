'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { depositsMock, productsLiteMock } from '@/lib/deposito/productsData' // borrar este al final del sprint
import type { Deposito, ProductoLite } from '@/lib/deposito/types'
import StockStatsCards from '@/components/depositos/StockStatsCards'
import StockFilters, { type StockFiltersState } from '@/components/depositos/StockFilters'
import StockTable from '@/components/depositos/StockTable'
import Link from 'next/link'

// Actualizado para incluir 'agotado'
export type StockStatus = 'agotado' | 'bajo' | 'normal' | 'alto'

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

// Actualizada para incluir agotado
function statusOf(item: { stockActual: number; stockMinimo: number; stockMaximo: number }): StockStatus {
  if (item.stockActual <= 0) return 'agotado'
  if (item.stockActual < item.stockMinimo) return 'bajo'
  if (item.stockMaximo > 0 && item.stockActual > item.stockMaximo) return 'alto'
  return 'normal'
}

const DEFAULT_FILTERS: StockFiltersState = { depositId: '', productQuery: '', status: '' }
const PAGE_SIZE = 10

export default function StockPage() {
  const searchParams = useSearchParams()
  const initialDepositId = useMemo<number | ''>(() => {
    const v = searchParams.get('depositId')
    const n = v ? Number(v) : NaN
    return Number.isFinite(n) && n > 0 ? n : ''
  }, [searchParams])

  // Estados actualizados
  const [deposits, setDeposits] = useState<Deposito[]>([])
  const [products, setProducts] = useState<ProductoLite[]>([])
  const [stock, setStock] = useState<UIStock[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<StockFiltersState>({
    ...DEFAULT_FILTERS,
    depositId: initialDepositId,
  })

  // --- sincronizar el filtro con el depositId de la URL ---
  useEffect(() => {
    if (initialDepositId !== '') {
      setFilters(prev => ({
        ...prev,
        depositId: initialDepositId
      }))
    }
  }, [initialDepositId])

  // Cargar datos desde la API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        // 1) construir URL (igual que lo tenías)
        const url = initialDepositId !== ''
          ? `/api/gestion-stock?depositId=${initialDepositId}&page=1&pageSize=100&sort=nombre&dir=asc&status=all`
          : `/api/gestion-stock?page=1&pageSize=100&sort=nombre&dir=asc&status=all`

        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`)

        // 2) parsear NUEVO shape
        type ApiRow = {
          id: number
          depositoId: number
          productoId: number
          deposito: string
          producto: string
          sku: string | null
          stock: number
          stockMinimo: number
          stockMaximo: number | null
          status: 'atZero' | 'belowMin' | 'overMax' | 'ok'
        }
        type ApiResponse = { page: number; pageSize: number; total: number; rows: ApiRow[] }

        const json: ApiResponse = await res.json()
        const rows = json.rows ?? []

        // 3) mapear status API -> UI
        const mapStatus = (s: ApiRow['status']): StockStatus =>
          s === 'atZero' ? 'agotado' :
            s === 'belowMin' ? 'bajo' :
              s === 'overMax' ? 'alto' : 'normal'

        // 4) mapear a tu UIStock
        const ui: UIStock[] = rows.map(r => ({
          id: r.id,
          depositId: r.depositoId,
          productId: r.productoId,
          depositNombre: r.deposito,
          depositUbicacion: '', // opcional: si luego devuelvo ubicacion desde la API lo rellenas acá
          productDescripcion: r.producto,
          stockActual: r.stock,
          stockMinimo: r.stockMinimo,
          stockMaximo: r.stockMaximo ?? 0,
          status: mapStatus(r.status),
          progress: r.stockMaximo ? Math.min((r.stock / r.stockMaximo) * 100, 100) : 0,
        }))

        setStock(ui)

        // 5) listas únicas de depósitos y productos para los filtros
        const uniqueDeposits = Array.from(
          new Map(
            rows.map(r => [
              r.depositoId,
              { id: r.depositoId, nombre: r.deposito, ubicacion: '' },
            ])
          ).values()
        ) as Deposito[]
        setDeposits(uniqueDeposits)

        const uniqueProducts = Array.from(
          new Map(
            rows.map(r => [
              r.productoId,
              { id: r.productoId, descripcion: r.producto, precioVenta: 0 },
            ])
          ).values()
        ) as ProductoLite[]
        setProducts(uniqueProducts)

      } catch (err) {
        console.error("4. ¡ERROR! La carga de datos falló:", err)
        // Fallback a datos mock (como ya tenías)
        setDeposits(depositsMock)
        setProducts(productsLiteMock)
      } finally {
        setLoading(false)
      }

    }

    loadData()
  }, [initialDepositId])

  // ---- Filtro (reactivo) ----
  const filtered = useMemo(() => {
    if (loading) return []

    // Reemplazá el byDeposit dentro de `filtered` por esto: ----------------------------------------------------
    const depositIdFilter = filters.depositId === '' ? null : Number(filters.depositId)
    const byDeposit = (s: UIStock) => !depositIdFilter || s.depositId === depositIdFilter
    //-----------------------------------------------------------------------------------------------------------
    const q = filters.productQuery.trim().toLowerCase()
    const byProduct = (s: UIStock) => !q || s.productDescripcion.toLowerCase().includes(q)
    const byStatus = (s: UIStock) => !filters.status || s.status === filters.status
    return stock.filter(s => byDeposit(s) && byProduct(s) && byStatus(s))
  }, [stock, filters, loading])

  // ---- Stats usan todos los filtrados ----
  const involvedDepositIds = useMemo(
    () => Array.from(new Set(filtered.map(r => r.depositId))),
    [filtered]
  )
  const involvedDeposits = useMemo(
    () => deposits.filter(d => involvedDepositIds.includes(d.id)),
    [deposits, involvedDepositIds]
  )

  // ---- Paginación ----
  const [page, setPage] = useState(1)
  useEffect(() => { setPage(1) }, [filters])
  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])

  const start = (page - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, totalItems)
  const pageItems = filtered.slice(start, end)

  // Loading state
  if (loading) {
    return (
      <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos de stock...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      <div className="screen-transition">
        {/* Breadcrumb - actualizado para mostrar depósito específico */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span>Inicio</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span>Depósito</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-primary-pink font-medium">
            {initialDepositId !== ''
              ? `Stock - ${deposits.find(d => d.id === initialDepositId)?.nombre || 'Depósito'}`
              : 'Stock por Depósito'
            }
          </span>
        </div>

        {/* Action Bar - título dinámico */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
              {initialDepositId !== ''
                ? `Stock - ${deposits.find(d => d.id === initialDepositId)?.nombre || 'Depósito'}`
                : 'Gestión de Stock'
              }
            </h2>
            <p className="text-gray-600 text-lg">
              {initialDepositId !== ''
                ? 'Inventario detallado del depósito seleccionado'
                : 'Control completo del inventario por depósito'
              }
            </p>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/depositos"
              className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 text-lg hover:shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver a Depósitos</span>
            </Link>
          </div>
        </div>

        {/* Stats (edge-to-edge) */}
        <section className="-mx-3 sm:-mx-4 lg:-mx-6 mb-8">
          <div className="px-3 sm:px-4 lg:px-6">
            <StockStatsCards stock={filtered} deposits={involvedDeposits} />
          </div>
        </section>

        {/* Filtros (ancho normal) */}
        <StockFilters
          deposits={deposits}
          products={products}
          value={filters}
          onChange={setFilters}
          onApply={() => { }}
        />

        {/* Tabla + footer (edge-to-edge) */}
        <section className="-mx-3 sm:-mx-4 lg:-mx-6">
          <div className="px-3 sm:px-4 lg:px-6">
            <StockTable items={pageItems} />

            <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
              <p className="text-gray-600 font-medium">
                {totalItems === 0 ? (
                  <>Mostrando <span className="font-bold text-primary-pink">0</span> de <span className="font-bold text-primary-pink">0</span> items</>
                ) : (
                  <>Mostrando <span className="font-bold text-primary-pink">{start + 1}-{end}</span> de <span className="font-bold text-primary-pink">{totalItems}</span> items</>
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
          </div>
        </section>
      </div>
    </main>
  )
}