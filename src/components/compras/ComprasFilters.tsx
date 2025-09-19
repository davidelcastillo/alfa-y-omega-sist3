// src/components/compras/ComprasFilters.tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { ComprasFiltersState } from "@/lib/compras/purchase";

type Props = {
  initial?: ComprasFiltersState;
  proveedores: { id: string; name: string }[];
  //depositos: string[];
  depositos: { id: string; name: string }[];   //
  onSearch: (f: ComprasFiltersState) => void;
  onClear?: () => void;
};

export default function ComprasFilters({ initial, proveedores, depositos, onSearch, onClear }: Props) {
  const [filters, setFilters] = useState<ComprasFiltersState>({
    fechaDesde: initial?.fechaDesde ?? "",
    fechaHasta: initial?.fechaHasta ?? "",
    numeroOC: initial?.numeroOC ?? "",
    proveedorId: initial?.proveedorId ?? "",
    //deposito: initial?.deposito ?? "",
    depositoId: initial?.depositoId ?? "",     // 👈 usa depositoId
  });

  function update<K extends keyof ComprasFiltersState>(k: K, v: ComprasFiltersState[K]) {
    setFilters((s) => ({ ...s, [k]: v }));
  }

  function handleClear() {
    //const reset = { fechaDesde: "", fechaHasta: "", numeroOC: "", proveedorId: "", deposito: "" };
    const reset: ComprasFiltersState = {
    fechaDesde: "",
    fechaHasta: "",
    numeroOC: "",
    proveedorId: "",
    depositoId: "",   // ✅ antes tenías 'deposito'
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
          label="Número de Orden"
          placeholder="OC-001..."
          value={filters.numeroOC ?? ""}
          onChange={(e) => update("numeroOC", e.target.value)}
        />
        <Select
          label="Proveedor"
          value={filters.proveedorId ?? ""}
          onChange={(e) => update("proveedorId", e.target.value)}
        >
          <option value="">Todos</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
        <Select
            label="Depósito"
            value={filters.depositoId ?? ""}
            onChange={(e) => update("depositoId", e.target.value)}
          >
            <option value="">Todos</option>
            {depositos.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
        </Select>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handleClear}>Limpiar Filtros</Button>
        <Button variant="azul"  onClick={() => onSearch(filters)}>Buscar Órdenes</Button>
      </div>
    </div>
  );
}
