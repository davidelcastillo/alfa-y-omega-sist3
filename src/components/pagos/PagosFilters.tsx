// src/components/pagos/PagosFilters.tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect"; // tu componente

// Estado de filtros (proveedorId numérico porque SearchableSelect usa id:number)
export type PagosFiltersState = {
  fechaDesde?: string;
  fechaHasta?: string;
  numeroFactura?: string;
  proveedorId?: number | 0;
};

type SelectOption = { id: number; nombre: string };

type Props = {
  initial?: PagosFiltersState;
  // ⚠️ MOCK: estas opciones vienen hoy de mocks; en prod deben venir de la DB
  proveedores?: SelectOption[];
  onSearch: (f: PagosFiltersState) => void;
  onClear?: () => void;
};

export default function PagosFilters({
  initial,
  proveedores = [], // ⚠️ MOCK
  onSearch,
  onClear,
}: Props) {
  const [filters, setFilters] = useState<PagosFiltersState>({
    fechaDesde: initial?.fechaDesde ?? "",
    fechaHasta: initial?.fechaHasta ?? "",
    numeroFactura: initial?.numeroFactura ?? "",
    proveedorId: initial?.proveedorId ?? 0,
  });

  function update<K extends keyof PagosFiltersState>(k: K, v: PagosFiltersState[K]) {
    setFilters((s) => ({ ...s, [k]: v }));
  }

  function handleClear() {
    const reset: PagosFiltersState = {
      fechaDesde: "",
      fechaHasta: "",
      numeroFactura: "",
      proveedorId: 0,
    };
    setFilters(reset);
    onClear?.();
  }

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover bg-white/95 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Input
          label="Fecha Desde"
          type="date"
          value={filters.fechaDesde ?? ""}
          onChange={(e) => update("fechaDesde", e.target.value)}
        />

        <Input
          label="Fecha Hasta"
          type="date"
          value={filters.fechaHasta ?? ""}
          onChange={(e) => update("fechaHasta", e.target.value)}
        />

        <Input
          label="N° de Factura"
          placeholder="FC-2024-001"
          value={filters.numeroFactura ?? ""}
          onChange={(e) => update("numeroFactura", e.target.value)}
        />

        {/* Proveedor — SearchableSelect (usa tu API de props exacta) */}
        <SearchableSelect
          label="Proveedor"
          options={proveedores} // ⚠️ MOCK: { id:number, nombre:string } — en prod, desde DB
          valueId={Number(filters.proveedorId ?? 0)}
          onChange={(opt) => update("proveedorId", opt?.id ?? 0)}
          placeholder="Buscar proveedor… (DB)"
        />

        {/* Slot libre para un quinto filtro a futuro */}
        <div className="hidden lg:block" />
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handleClear}>
          Limpiar Filtros
        </Button>
        <Button variant="azul" onClick={() => onSearch(filters)}>
          Buscar Pagos
        </Button>
      </div>
    </div>
  );
}
