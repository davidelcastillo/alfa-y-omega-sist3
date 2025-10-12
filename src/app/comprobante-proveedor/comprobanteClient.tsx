"use client"

import { useMemo, useState } from "react"
import ComprasFilters from "@/components/comprobante-proveedor/ComprobanteFilters"
import ComprasTable from "@/components/comprobante-proveedor/ComprobanteTable"
import ComprobanteStatsCards from "@/components/comprobante-proveedor/ComprobanteStatsCards"
// ⬇️ Se elimina ComprobanteModal porque aquí no se edita/crea

import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"

import { applyFilters, applySort } from "@/lib/comprobante-proveedor/utils"
import type { ComprobanteProveedor, ComprobanteFiltersState } from "@/lib/comprobante-proveedor/comprobante"
import type { ComprobanteListItem } from "@/lib/comprobante-proveedor/types"
import useComprobanteSort from "./hooks/useComprobanteSort"
import usePagination from "./hooks/usePagination"
// ⬇️ Se elimina useModal
import { createComprobanteAction } from "./actions/comprobante" // si no se usa, podés borrarlo también
import { useRouter } from "next/navigation"

type Props = {
  initialComprobantes: ComprobanteProveedor[]
}

export default function ComprobanteClient({ initialComprobantes }: Props) {
  const [comprobantes, setComprobantes] = useState<ComprobanteProveedor[]>(initialComprobantes)
  const [filters, setFilters] = useState<ComprobanteFiltersState>({})

  const { sort, setSort } = useComprobanteSort({ key: "fecha", dir: "desc" })
  const router = useRouter()

  // Filtros + orden
  const filtered = useMemo(() => applyFilters(comprobantes, filters), [comprobantes, filters])
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort])
  const { page, pageItems, totalPages, next, prev, setPage, reset } = usePagination(sorted, 10)

  // Stats
  const montoTotal = useMemo(() => filtered.reduce((s, c) => s + (c.total ?? 0), 0), [filtered])
  const conSaldo = useMemo(() => filtered.filter((c) => (c.saldo ?? 0) > 0).length, [filtered])
  const cancelados = useMemo(() => filtered.filter((c) => (c.saldo ?? 0) === 0).length, [filtered])

  // Mapper: ComprobanteProveedor -> ComprobanteListItem
const listItems: ComprobanteListItem[] = useMemo(() => {
  return pageItems.map((c) => {
    const idNum = typeof c.id === "number" ? c.id : Number(c.id)
    const total = Number(c.total ?? 0)
    const saldo = Number(c.saldo ?? 0)
    const pagado = Math.max(total - saldo, 0)
    const pendiente = Math.max(saldo, 0)

    // proveedor es obligatorio en ComprobanteListItem
    const provId = c.proveedor?.id
    const proveedor = provId != null
      ? { id: typeof provId === "number" ? provId : Number(provId), name: c.proveedor!.name ?? "-" }
      : { id: 0, name: "-" } // fallback

    // deposito puede ser null
    const depId = c.deposito?.id
    const deposito = depId != null
      ? { id: typeof depId === "number" ? depId : Number(depId), name: c.deposito!.name ?? "-" }
      : null

    // ordenCompra puede ser null
    const ocId = (c as any).ordenCompra?.id
    const ordenCompra = ocId != null
      ? { id: typeof ocId === "number" ? ocId : Number(ocId) }
      : null

    // estado boolean requerido (intento usar el real; si no, lo derivo)
    const estado: boolean = typeof (c as any).estado === "boolean"
      ? (c as any).estado
      : saldo === 0

    return {
      id: idNum,
      nro_comprobante: (c as any).nro_comprobante ?? (c as any).numero ?? null,
      proveedor,
      tipo_comprobante: (c as any).tipo_comprobante ?? (c as any).tipo ?? null,
      ordenCompra,
      deposito,
      total,
      pagado,
      pendiente,
      saldo,
      fecha: (c as any).fecha ?? null, // "YYYY-MM-DD" | null
      estado,
    }
  })
}, [pageItems])

  // Handlers
  function onSearch(f: ComprobanteFiltersState) {
    setFilters(f)
    reset()
  }

  function onClear() {
    setFilters({})
    reset()
  }

  function onView(id: number) {
    router.push(`/comprobante-proveedor/${id}`)
  }

  function onOpenNew() {
    router.push("/comprobante-proveedor/nuevo")
  }

  // si no creás acá, podés borrar todo lo relacionado a createComprobanteAction y handleSubmit
  // lo dejo fuera para no confundir

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
      <ComprasFilters
        proveedores={useMemo(() => {
          const map = new Map<string, { id: string; name: string }>()
          comprobantes.forEach(c => {
            if (c.proveedor?.id != null) map.set(String(c.proveedor.id), { id: String(c.proveedor.id), name: c.proveedor.name })
          })
          return Array.from(map.values())
        }, [comprobantes])}
        depositos={useMemo(() => {
          const map = new Map<string, { id: string; name: string }>()
          comprobantes.forEach(c => {
            if (c.deposito?.id != null) map.set(String(c.deposito.id), { id: String(c.deposito.id), name: c.deposito.name })
          })
          return Array.from(map.values())
        }, [comprobantes])}
        onSearch={onSearch}
        onClear={onClear}
      />

      {/* Tabla */}
      <ComprasTable
        comprobantes={listItems}
        onView={onView}
        onSort={(s) => setSort(s)}
        sortState={sort}
      />

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