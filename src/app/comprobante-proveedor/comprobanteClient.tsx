"use client"

import { useMemo, useState } from "react"
import ComprasFilters from "@/components/comprobante-proveedor/ComprobanteFilters"
import ComprasTable from "@/components/comprobante-proveedor/ComprobanteTable"
import ComprobanteStatsCards from "@/components/comprobante-proveedor/ComprobanteStatsCards"
import ComprobanteModal from "@/components/comprobante-proveedor/ComprobanteModal"
import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"
import { applyFilters, applySort } from "@/lib/comprobante-proveedor/utils"
import type { ComprobanteProveedor, ComprobanteFiltersState } from "@/lib/comprobante-proveedor/comprobante"
import useComprobanteSort from "./hooks/useComprobanteSort"
import usePagination from "./hooks/usePagination"
import useModal from "./hooks/useModal"
import { createComprobanteAction } from "./actions/comprobante"
import { useRouter } from "next/navigation"

type Props = {
  initialComprobantes: ComprobanteProveedor[]
}

export default function ComprobanteClient({ initialComprobantes }: Props) {
  const [comprobantes, setComprobantes] = useState<ComprobanteProveedor[]>(initialComprobantes)
  const [filters, setFilters] = useState<ComprobanteFiltersState>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  const { sort, setSort } = useComprobanteSort({ key: "fecha", dir: "desc" })
  const { open, setOpen, openModal, closeModal } = useModal(false)
  const router = useRouter()

  // Filtros + orden
  const filtered = useMemo(() => applyFilters(comprobantes, filters), [comprobantes, filters])
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort])
  const { page, pageItems, totalPages, next, prev, setPage, reset } = usePagination(sorted, 10)

  // Stats
  const montoTotal = useMemo(() => filtered.reduce((s, c) => s + c.total, 0), [filtered])
  const conSaldo = useMemo(() => filtered.filter((c) => c.saldo > 0).length, [filtered])
  const cancelados = useMemo(() => filtered.filter((c) => c.saldo === 0).length, [filtered])

  // Handlers
  function onSearch(f: ComprobanteFiltersState) {
    setFilters(f)
    reset()
  }

  function onClear() {
    setFilters({})
    reset()
  }

  function onView(id: string) {
    router.push(`/comprobante-proveedor/${id}`)
  }

  function onEdit(id: string) {
    setEditingId(id)
    openModal()
  }

  function onOpenNew() {
    setEditingId(null)
    router.push("/comprobante-proveedor/nuevo")
  }

  async function handleSubmit(payload: any) {
    setEditingId(null)
    closeModal()

    try {
      const newComprobante = await createComprobanteAction(payload)
      setComprobantes((prev) => [newComprobante, ...prev])
      setPage(1)
    } catch (err) {
      console.error(err)
      alert("Error al crear el comprobante")
    }
  }

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Gestión de Comprobantes de Proveedor
          </h2>
          <p className="text-gray-600 text-lg">Administra y controla todos los comprobantes de proveedor</p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="primary"
            size="lg"
            className="px-8 py-8 rounded-xl gap-3 text-lg hover:shadow-lg"
            onClick={onOpenNew}
          >
            <Plus className="w-10 h-5 mr-2" aria-hidden />
            Nuevo Comprobante
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ComprobanteStatsCards total={filtered.length} conSaldo={conSaldo} cancelados={cancelados} montoTotal={montoTotal} />

      {/* Filtros */}
      <ComprasFilters  proveedores={comprobantes.map(c => c.proveedor).filter(Boolean)}
  depositos={comprobantes.map(c => c.deposito).filter(Boolean)}
  onSearch={onSearch}
  onClear={onClear} />

      {/* Tabla */}
      <ComprasTable comprobantes={pageItems} onView={onView} onEdit={onEdit} onSort={(s) => setSort(s)} sortState={sort} />

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
        <span>Página {page} de {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={prev} disabled={page <= 1}>Anterior</Button>
          <Button variant="outline" onClick={next} disabled={page >= totalPages}>Siguiente</Button>
        </div>
      </div>
    </main>
  )
}
