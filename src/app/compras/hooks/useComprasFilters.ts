// src/app/compras/hooks/useComprasFilters.ts
"use client";

import { useState } from "react";
import type { ComprasFiltersState } from "@/lib/compras/purchase";

export default function useComprasFilters(initial?: ComprasFiltersState) {
  const [filters, setFilters] = useState<ComprasFiltersState>({
    fechaDesde: initial?.fechaDesde ?? "",
    fechaHasta: initial?.fechaHasta ?? "",
    numeroOC: initial?.numeroOC ?? "",
    proveedorId: initial?.proveedorId ?? "",
    deposito: initial?.deposito ?? "",
  });

  function update<K extends keyof ComprasFiltersState>(k: K, v: ComprasFiltersState[K]) {
    setFilters((s) => ({ ...s, [k]: v }));
  }

  function reset() {
    setFilters({ fechaDesde: "", fechaHasta: "", numeroOC: "", proveedorId: "", deposito: "" });
  }

  return { filters, setFilters, update, reset };
}
