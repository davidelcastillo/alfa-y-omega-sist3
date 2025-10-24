// src/components/facturas/FacturasFilters.tsx
"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
// Importa el tipo de los filtros de facturas que definimos antes
import type { FiltersState } from "@/lib/facturas/types";

type FacturasFiltersProps = {
  value: FiltersState;
  loading?: boolean;
  onChange: (next: FiltersState) => void;
  onSearch?: (by: FiltersState) => void;
  onClear?: () => void;
};

export default function FacturasFilters({
  value,
  loading,
  onChange,
  onSearch,
  onClear,
}: FacturasFiltersProps) {

  function update<K extends keyof FiltersState>(k: K, v: FiltersState[K]) {
    const nextState = { ...value, [k]: v };
    onChange(nextState);
  }

  function handleClear() {
    onClear?.();
  }

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover bg-white/95 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Input
          label="Fecha desde"
          type="date"
          value={value.from ?? ""}
          onChange={(e) => update("from", e.target.value)}
        />
        <Input
          label="Fecha hasta"
          type="date"
          value={value.to ?? ""}
          onChange={(e) => update("to", e.target.value)}
        />
        <Input
          label="Número de factura"
          placeholder="Ej: 0001-000123"
          value={value.numeroComprobante ?? ""}
          onChange={(e) => update("numeroComprobante", e.target.value)}
        />
        {/*
        <Select
          label="Estado de Pago"
          value={value.estadoPago ?? ""}
          onChange={(e) => update("estadoPago", e.target.value as FiltersState["estadoPago"])}
        >
          <option value="">Todos los estados</option>
          <option value="Pagado">Pagado</option>
          <option value="Pendiente">Pendiente</option>
        </Select>
        */}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handleClear} disabled={!!loading}>
          Limpiar Filtros
        </Button>
        <Button variant="azul" onClick={() => onSearch?.(value)} disabled={!!loading}>
          Buscar Facturas
        </Button>
      </div>
    </div>
  );
}