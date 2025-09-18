// src/app/compras/ComprasClient.tsx
"use client";

import { useMemo, useState } from "react";

import ComprasFilters from "@/components/compras/ComprasFilters";
import ComprasTable from "@/components/compras/ComprasTable";
import ComprasStatsCards from "@/components/compras/ComprasStatsCards";
import ComprasModal from "@/components/compras/ComprasModal";

import { Button } from "@/components/ui/Button";
import { Plus } from 'lucide-react';
import { applyFilters, applySort } from "@/lib/compras/utils";
import type {
  ComprasFiltersState,
  Product,
  PurchaseOrder,
  PurchaseOrderItem,
  SortState,
  Supplier,
} from "@/lib/compras/purchase";

//import { createOrderAction } from "./actions/orders";
import useComprasSort from "./hooks/useComprasSort";
import usePagination from "./hooks/usePagination";
import useModal from "./hooks/useModal";

type Props = {
  initialOrders: PurchaseOrder[];
  proveedores: Supplier[];
  depositos: string[];
  productos: Product[];
};

export default function ComprasClient({ initialOrders, proveedores, depositos, productos }: Props) {
  // Estado base
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [filters, setFilters] = useState<ComprasFiltersState>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Hooks propios
  const { sort, setSort, toggle } = useComprasSort({ key: "creationDate", dir: "desc" });
  const { open, setOpen, openModal, closeModal } = useModal(false);

  // Derivados: filtros → sort → paginación
  const filtered = useMemo(() => applyFilters(orders, filters), [orders, filters]);
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const { page, pageItems, totalPages, next, prev, setPage, reset } = usePagination(sorted, 10);

  // Stats (sobre el conjunto filtrado)
  const completas = useMemo(() => filtered.filter((o) => o.status === "Completa").length, [filtered]);
  const incompletas = useMemo(() => filtered.filter((o) => o.status === "Incompleta").length, [filtered]);
  const montoTotal = useMemo(() => filtered.reduce((s, o) => s + o.total, 0), [filtered]);

  // Handlers de Filtros
  function onSearch(f: ComprasFiltersState) {
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
    alert(`Ver detalle de ${id} (pendiente de /compras/[id])`);
  }

  // Editar
  function onEdit(id: string) {
    setEditingId(id);
    openModal();
  }


  // Crear / Actualizar (server actions)
  async function handleSubmit(payload: {
    proveedorId: string;
    deposito: string;
    fechaEntrega: string; // yyyy-mm-dd
    items: PurchaseOrderItem[];
    totalCantidad: number;
    totalMonto: number;
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

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
          {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Movimiento de Stock</span>
      </div>
    
      {/* Header de la sección */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Gestión de Compras
          </h2>
          <p className="text-gray-600 text-lg">Administra y controla todas las órdenes de compra</p>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="primary"
            size="lg"
            className="px-8 py-8 rounded-xl gap-3 text-lg hover:shadow-lg"
            onClick={onOpenNew}
          >
            <Plus className="w-10 h-5 mr-2" aria-hidden />
            Nueva Orden</Button>
        </div>
      </div>

      {/* Stats */}
      <ComprasStatsCards total={filtered.length} completas={completas} incompletas={incompletas} montoTotal={montoTotal} />

      {/* Filtros */}
      <ComprasFilters proveedores={proveedoresOptions} depositos={depositos} onSearch={onSearch} onClear={onClear} />

      {/* Tabla (paginada) */}
      <ComprasTable
        orders={pageItems}
        onView={onView}
        //onEdit={onEdit}
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
      <ComprasModal
        open={open}
        onOpenChange={setOpen}
        proveedores={proveedoresOptions}
        depositos={depositos}
        productos={productos}
        initial={
          editingId
            ? (() => {
                const o = orders.find((x) => x.id === editingId)!;
                return {
                  proveedorId: o.supplier.id,
                  deposito: o.warehouse,
                  fechaEntrega: toYYYYMMDD(o.deliveryDate),
                  items: o.items,
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
