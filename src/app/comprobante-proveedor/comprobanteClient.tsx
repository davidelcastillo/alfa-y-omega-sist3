// src/app/compras/comprobanteClient.tsx
"use client";

import { useMemo, useState } from "react";

import ComprobanteFilters from "@/components/comprobante-proveedor/ComprobanteFilters";
import ComprobanteTable from "@/components/comprobante-proveedor/ComprobanteTable";
import ComprobanteStatsCards from "@/components/comprobante-proveedor/ComprobanteStatsCards";
import ComprobanteModal from "@/components/comprobante-proveedor/ComprobanteModal";

import { Button } from "@/components/ui/Button";
import { Plus } from 'lucide-react';
import { applyFilters, applySort } from "@/lib/comprobante-proveedor/utils";
import type {
  ComprobanteFiltersState,
  Product,
  ComprobanteProveedor,
  DetalleComprobanteProveedor,
  SortState,
  Supplier,
  TipoComprobante,
  TipoMovimiento,
  PurchaseOrder,
  MetodoPago,
  Deposito,
} from "@/lib/comprobante-proveedor/comprobante";

// import { createComprobanteAction } from "./actions/comprobante";
import useComprobanteSort from "./hooks/useComprobanteSort";
import usePagination from "./hooks/usePagination";
import useModal from "./hooks/useModal";
import ComprasFilters from "@/components/comprobante-proveedor/ComprobanteFilters";
import ComprasTable from "@/components/comprobante-proveedor/ComprobanteTable";


type Props = {
  initialComprobantes: ComprobanteProveedor[];
  proveedores: Supplier[];
  depositos: Deposito[];
  productos: Product[];
  tiposComprobante: TipoComprobante[];
  tiposMovimiento: TipoMovimiento[];
  metodosPagos: MetodoPago[];
  ordenCompra: PurchaseOrder[];
};

export default function ComprobanteClient({ 
  initialComprobantes,
  proveedores,
  depositos,
  productos,
  tiposComprobante,
  tiposMovimiento,
  metodosPagos,
  ordenCompra,
}: Props) {
  // Estado base
  const [comprobantes, setComprobantes] = useState<ComprobanteProveedor[]>(initialComprobantes);
  const [filters, setFilters] = useState<ComprobanteFiltersState>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Hooks propios
  const { sort, setSort, toggle } = useComprobanteSort({ key: "fecha", dir: "desc" });
  const { open, setOpen, openModal, closeModal } = useModal(false);

  // Derivados: filtros → sort → paginación
  const filtered = useMemo(() => applyFilters(comprobantes, filters), [comprobantes, filters]);
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const { page, pageItems, totalPages, next, prev, setPage, reset } = usePagination(sorted, 10);

  // Stats (sobre el conjunto filtrado)
  const montoTotal = useMemo(() => filtered.reduce((s, c) => s + c.total, 0), [filtered]);
  const conSaldo = useMemo(() => filtered.filter((c) => c.saldo > 0).length, [filtered]);
  const cancelados = useMemo(() => filtered.filter((c) => c.saldo === 0).length, [filtered]);

  // Handlers de Filtros
  function onSearch(f: ComprobanteFiltersState) {
    setFilters(f);
    reset(); // volver a página 1 al buscar
  }
  function onClear() {
    setFilters({});
    reset();
  }

  // Navegación “Ver”
  function onView(id: string) {
    // TODO: reemplazar por router.push(`/compras/${id}`)
    alert(`Ver detalle de comprobante ${id}`);
  }

  // Editar
  function onEdit(id: string) {
    setEditingId(id);
    openModal();
  }


  // Crear / Actualizar (server actions)
  async function handleSubmit(payload: {
    proveedorId: string;
    depositoId: string;
    fecha: string;
    items: DetalleComprobanteProveedor[];
    totalCantidad: number;
    totalMonto: number;
    tipoMovimientoId: string;
    tipoComprobanteId: string;
    metodoPagoId: string;
    ordenCompraId: string;
    letra?: string | null;
    numeroSucursal?: string | null;
    numero?: string;
    moneda?: string | null;
    observaciones?: string | null;
  }) {
    setOpen(false);
    setEditingId(null);
    // TODO: disparar ToastNotificacion si querés
  }

  function onOpenNew() {
    setEditingId(null);
    openModal();
  }

  // Opciones para filtros y modal (shape esperado por tus components)
  const proveedoresOptions = proveedores.map((p) => ({ id: p.id, name: p.name }));
  const depositosOptions = depositos.map((d) => ({ id: d.id, name: d.name }));
  const tiposComprobanteOptions = tiposComprobante.map((t) => ({ id: t.id, name: t.name }));
  const tiposMovimientoOptions = tiposMovimiento.map((t) => ({ id: t.id, name: t.name, saldo: t.saldo }));
  const metodosPagoOptions = metodosPagos.map((m) => ({ id: m.id, name: m.name }));
  // const ordenCompraOptions = ordenCompra.map((o) => ({ id: o.id, name: `${o.id} - ${o.supplier.name}` }));

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
          {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Comprobantes de Proveedor</span>
      </div>
    
      {/* Header de la sección */}
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
            Nueva Comprobante</Button>
        </div>
      </div>

      {/* Stats */}
      <ComprobanteStatsCards total={filtered.length} conSaldo={conSaldo} cancelados={cancelados} montoTotal={montoTotal} />

      {/* Filtros */}
      <ComprasFilters proveedores={proveedoresOptions} depositos={depositosOptions} onSearch={onSearch} onClear={onClear} />

      {/* Tabla (paginada) */}
      <ComprasTable
        comprobantes={pageItems}
        onView={onView}
        onSort={(s) => setSort(s)}
        sortState={sort}
      />

      {/* Controles de paginación simples */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Página {page} de {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={prev} disabled={page <= 1}>Anterior</Button>
          <Button variant="outline" onClick={next} disabled={page >= totalPages}>Siguiente</Button>
        </div>
      </div>

      {/* Modal */}
      <ComprobanteModal
        open={open}
        onOpenChange={setOpen}
        proveedores={proveedoresOptions}
        depositos={depositosOptions}
        productos={productos}
        tipoComprobantes={tiposComprobanteOptions}
        tipoMovimientos={tiposMovimientoOptions}
        metodoPagos={metodosPagoOptions}
        ordenCompra={ordenCompra}
        initial={
          editingId
            ? (() => {
                const c = comprobantes.find((x) => x.id === editingId)!;
                return {
                  proveedorId: c.proveedor.id,
                  depositoId: c.deposito.id,
                  fecha: c.fecha.split("T")[0],
                  numero: c.numero,
                  tipoComprobanteId: c.tipoComprobante.id,
                  metodoPagoId: c.metodoPagoId?.id ?? "",
                  items: c.items,
                };
              })()
            : undefined
        }
        onSubmit={handleSubmit}
      />
  </main>  
);
}

/* ========= Helpers locales ========= */
function pad(n: number) { return n.toString().padStart(2, "0"); }

function toYYYYMMDD(dd_mm_yyyy: string) {
  const [d, m, y] = dd_mm_yyyy.split("/").map(Number);
  return `${y}-${pad(m)}-${pad(d)}`;
}
