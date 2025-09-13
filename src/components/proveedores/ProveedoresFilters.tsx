// components/proveedores/ProveedoresFilters.tsx
"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export type CategoriaFiscal =
  | "Consumidor Final"
  | "Exento"
  | "Monotributista"
  | "Responsable Inscripto"
  | "Exterior";

export type FiltroEstado = "" | "Activo" | "Inactivo";

export type ProveedoresFiltersState = {
  searchName: string;
  searchCode: string;
  status: FiltroEstado;
  category: "" | CategoriaFiscal;
};

type Props = {
  value: ProveedoresFiltersState;
  onChange: (next: ProveedoresFiltersState) => void;
  onSearch?: () => void;
  onClear?: () => void;
};

const CATEGORIAS: CategoriaFiscal[] = [
  "Consumidor Final",
  "Exento",
  "Monotributista",
  "Responsable Inscripto",
  "Exterior",
];

export default function ProveedoresFilters({
  value,
  onChange,
  onSearch,
  onClear,
}: Props) {
  const set = useCallback(
    <K extends keyof ProveedoresFiltersState>(
      key: K,
      val: ProveedoresFiltersState[K]
    ) => {
      onChange({ ...value, [key]: val });
    },
    [value, onChange]
  );

  return (
    <div className="glass-effect rounded-2xl p-6 md:p-8 mb-8 card-hover">
      <h3 className="text-xl font-semibold text-dark-blue mb-6">
        Filtros de Búsqueda
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Buscar por nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Buscar por Nombre
          </label>
          <Input
            placeholder="Nombre o razón social..."
            className="input-focus"
            value={value.searchName}
            onChange={(e) => set("searchName", e.target.value)}
          />
        </div>

        {/* Código */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Código de Proveedor
          </label>
          <Input
            placeholder="Código..."
            className="input-focus"
            value={value.searchCode}
            onChange={(e) => set("searchCode", e.target.value)}
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Estado
          </label>
          <Select
            className="input-focus"
            value={value.status}
            onChange={(e) => set("status", e.target.value as FiltroEstado)}
          >
            <option value="">Todos</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </Select>
        </div>

        {/* Categoría Fiscal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Categoría Fiscal
          </label>
          <Select
            className="input-focus"
            value={value.category}
            onChange={(e) =>
              set("category", e.target.value as ProveedoresFiltersState["category"])
            }
          >
            <option value="">Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          variant="outline"
          //className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:shadow-lg"
          onClick={onClear}
        >
          Limpiar Filtros
        </Button>
        <Button
          type="button"
            variant="ghost"
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-blue to-dark-blue text-white hover:shadow-lg"
          onClick={onSearch}
        >
          Buscar Proveedores
        </Button>
      </div>
    </div>
  );
}
