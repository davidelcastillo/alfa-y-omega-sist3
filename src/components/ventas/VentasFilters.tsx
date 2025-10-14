"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export type FiltersState = {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  orderNumber?: string;
  status?: "" | "Enviado" | "Pendiente de enviar";
};

type VentasFiltersProps = {
  value?: FiltersState;
  defaultValue?: FiltersState;
  loading?: boolean;
  onChange?: (next: FiltersState) => void;
  onSearch?: (by: FiltersState) => void;
  onClear?: () => void;
};

export default function VentasFilters({
  value,
  defaultValue,
  loading,
  onChange,
  onSearch,
  onClear,
}: VentasFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    from: value?.from ?? defaultValue?.from ?? "",
    to: value?.to ?? defaultValue?.to ?? "",
    orderNumber: value?.orderNumber ?? defaultValue?.orderNumber ?? "",
    status: value?.status ?? defaultValue?.status ?? "",
  });

  // Sincroniza con cambios externos en `value`
  useEffect(() => {
    if (!value) return;
    setFilters({
      from: value.from ?? "",
      to: value.to ?? "",
      orderNumber: value.orderNumber ?? "",
      status: value.status ?? "",
    });
  }, [value?.from, value?.to, value?.orderNumber, value?.status]);

  function update<K extends keyof FiltersState>(k: K, v: FiltersState[K]) {
    setFilters((prev) => {
      const next = { ...prev, [k]: v };
      onChange?.(next);
      return next;
    });
  }

  function handleClear() {
    const reset: FiltersState = { from: "", to: "", orderNumber: "", status: "" };
    setFilters(reset);
    onClear?.();
    onChange?.(reset);
  }

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover bg-white/95 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Input
          label="Fecha desde"
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => update("from", e.target.value)}
        />
        <Input
          label="Fecha hasta"
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => update("to", e.target.value)}
        />
        <Input
          label="Número de pedido"
          placeholder="Ej: PED-001"
          value={filters.orderNumber ?? ""}
          onChange={(e) => update("orderNumber", e.target.value)}
        />
        <Select
          label="Estado"
          value={filters.status ?? ""}
          onChange={(e) => update("status", e.target.value as FiltersState["status"])}
        >
          <option value="">Todos los estados</option>
          <option value="Enviado">Enviado</option>
          <option value="Pendiente de enviar">Pendiente de enviar</option>
        </Select>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handleClear} disabled={!!loading}>
          Limpiar Filtros
        </Button>
        <Button variant="azul" onClick={() => onSearch?.(filters)} disabled={!!loading}>
          Buscar Pedidos
        </Button>
      </div>
    </div>
  );
}
