// src/app/proveedores/page.tsx
"use client";

import { useMemo, useState } from "react";

// Componentes del módulo
import StatsCards from "@/components/proveedores/StatsCards";
import ProveedoresFilters from "@/components/proveedores/ProveedoresFilters";
import ProveedoresTable from "@/components/proveedores/ProveedoresTable";
import ProveedoresModal, { type SupplierForm } from "@/components/proveedores/ProveedoresModal";
import Button from "@/components/ui/Button";

// Tipos, mocks y helpers
import type {
  Supplier,
  ProveedoresFiltersState,
} from "@/lib/proveedores/types";
import { suppliersMock } from "@/lib/proveedores/mocks";
import {
  filterSuppliers,
  computeStats,
  nextSupplierId,
  toggleStatus,
  sortByFechaRegistroDesc,
} from "@/lib/proveedores/helpers";

export default function ProveedoresPage() {
  // Estado base (ordenado por fecha desc)
  const [suppliers, setSuppliers] = useState<Supplier[]>(
    sortByFechaRegistroDesc(suppliersMock)
  );

  // Filtros controlados
  const [filters, setFilters] = useState<ProveedoresFiltersState>({
    searchName: "",
    searchCode: "",
    status: "",
    category: "",
  });

  // Modal create/edit
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);

  // Derivados
  const filtered = useMemo(
    () => filterSuppliers(suppliers, filters),
    [suppliers, filters]
  );

  const stats = useMemo(() => computeStats(suppliers), [suppliers]);

  // Handlers
  function handleCreate() {
    setEditing(null);
    setOpenModal(true);
  }

  function handleEdit(id: number) {
    const row = suppliers.find((x) => x.id === id) || null;
    setEditing(row);
    setOpenModal(true);
  }

  function handleToggleStatus(id: number) {
    setSuppliers((arr) =>
      arr.map((x) => (x.id === id ? toggleStatus(x) : x))
    );
  }

  function handleSubmit(payload: SupplierForm) {
    if (editing) {
      // EDIT
      setSuppliers((arr) =>
        sortByFechaRegistroDesc(
          arr.map((x) => (x.id === editing.id ? { ...x, ...payload, id: editing.id } : x))
        )
      );
      return;
    }

    // CREATE
    const newItem: Supplier = {
      ...(payload as Supplier),
      id: nextSupplierId(suppliers),
      estado: payload.estado ?? "Activo",
      fechaRegistro: new Date().toISOString().slice(0, 10),
    };

    setSuppliers((arr) => sortByFechaRegistroDesc([newItem, ...arr]));
  }

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <span>Inicio</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
        <span className="text-primary-pink font-medium">Depósito</span>
      </div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Gestión de Proveedores
          </h2>
          <p className="text-gray-600 text-lg">
            Administra y controla toda la información de tus proveedores
          </p>
        </div>

        <div className="flex space-x-4">
            <Button
                variant="primary"
                size="lg"
                onClick={handleCreate}
                className="px-8 py-8 rounded-xl space-x-3 text-lg hover:shadow-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                <span>Nuevo Proveedor</span>
            </Button>

            {/*Ver si hay que borrar esto o no
            <Button
                variant="outline"
                size="lg"
                onClick={() => {
                setSuppliers((arr) => sortByFechaRegistroDesc([...arr]));
                }}
                className="bg-gradient-to-r from-primary-blue to-dark-blue text-white hover:shadow-lg border-0"
            >

                <span>Actualizar</span>
            </Button> */}
          </div>
      </div>

      {/* Stats */}
      <StatsCards
        total={stats.total}
        activos={stats.activos}
        inactivos={stats.inactivos}
      />

      {/* Filtros */}
      <ProveedoresFilters
        value={filters}
        onChange={setFilters}
        onSearch={() => {
          // Si más adelante haces fetch server-side, podés dispararlo acá
        }}
        onClear={() =>
          setFilters({ searchName: "", searchCode: "", status: "", category: "" })
        }
      />

      {/* Tabla */}
      <ProveedoresTable
        data={filtered}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        pageSize={10}
      />

      {/* Modal (create/edit) */}
      <ProveedoresModal
        open={openModal}
        mode={editing ? "edit" : "create"}
        initialData={editing || undefined}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
