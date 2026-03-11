// src/components/usuarios/Filters.tsx
"use client";

import { useEffect, useState } from "react";
import type { Rol } from "@/generated/prisma";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export type UserFilters = {
  search: string;
  rolId: string;   // guardamos como string para el <select>
  estado: string;  // "Activo" | "Inactivo" | ""
};

type Props = {
  roles: Rol[];
  value: UserFilters;
  onChange: (filters: UserFilters) => void;
};

export default function Filters({ roles, value, onChange }: Props) {
  const [filters, setFilters] = useState<UserFilters>(value);

  // Sincroniza con cambios externos en `value`
  useEffect(() => {
    setFilters(value);
  }, [value]);

  function update<K extends keyof UserFilters>(k: K, v: UserFilters[K]) {
    setFilters(prev => {
      const next = { ...prev, [k]: v };
      return next;
    });
  }

  function handleApply() {
    onChange(filters);
  }

  function handleClear() {
    const cleared: UserFilters = { search: "", rolId: "", estado: "" };
    setFilters(cleared);
    onChange(cleared);
  }

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover bg-white/95 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Filtros de Usuarios</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Input
          label="Buscar"
          id="search"
          name="search"
          placeholder="Nombre, email..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />

        <Select
          label="Rol"
          id="rolId"
          name="rolId"
          value={filters.rolId}
          onChange={(e) => update("rolId", e.target.value)}
        >
          <option value="">Todos</option>
          {roles.map((rol) => (
            <option key={rol.id} value={String(rol.id)}>
              {rol.nombre}
            </option>
          ))}
        </Select>

        <Select
          label="Estado"
          id="estado"
          name="estado"
          value={filters.estado}
          onChange={(e) => update("estado", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </Select>

        {/* Botones */}
        <div className="flex items-end gap-3">
          <Button variant="outline" className="w-1/2" onClick={handleClear}>
            Limpiar
          </Button>
          <Button variant="azul" className="w-1/2" onClick={handleApply}>
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
