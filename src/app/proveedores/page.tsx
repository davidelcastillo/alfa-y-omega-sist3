"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

// Componentes del módulo
import StatsCards from "@/components/proveedores/StatsCards";
import ProveedoresFilters from "@/components/proveedores/ProveedoresFilters";
import ProveedoresTable from "@/components/proveedores/ProveedoresTable";
import ProveedoresModal, { type SupplierForm } from "@/components/proveedores/ProveedoresModal";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Tipos y helpers (sin mocks)
import type { Supplier, ProveedoresFiltersState } from "@/lib/proveedores/types";
import { filterSuppliers, computeStats, toggleStatus } from "@/lib/proveedores/helpers";

/* =========================
   Mapeos entre tipos
   ========================= */

// Supplier -> SupplierForm (para abrir el modal en modo edición)
function supplierToForm(s: Supplier): SupplierForm {
  return {
    id: s.id,
    codigo: (s as any).codigo ?? "",
    tipo: (s as any).tipo ?? "empresa",
    razonSocial: (s as any).razonSocial ?? "",
    nombreCompleto: (s as any).nombreCompleto ?? "",
    nombreFantasia: (s as any).nombreFantasia ?? "",
    genero: (s as any).genero ?? "",
    // en el form guardamos el ID como string
    categoriaFiscal: s && (s as any).categoriaFiscal
      ? String((s as any).categoriaFiscal.id ?? "")
      : "",
    cuitCuil: (s as any).cuitCuil ?? (s as any).cuil ?? "",
    pais: (s as any).pais ?? "Argentina",
    codigoPostal: (s as any).codigoPostal ?? "",
    provincia: (s as any).provincia ?? "",
    localidad: (s as any).localidad ?? "",
    zona: (s as any).zona ?? "",
    barrio: (s as any).barrio ?? "",
    telefono: (s as any).telefono ?? "",
    email: (s as any).email ?? (s as any).correoElectronico ?? "",
    paginaWeb: (s as any).paginaWeb ?? "",
    estado: (s as any).estado ?? "Activo",
  };
}

// SupplierForm -> DTO esperado por POST /api/proveedores
function formToCreateDTO(f: SupplierForm) {
  const nombreBase =
    (f.tipo === "empresa" ? f.razonSocial : f.nombreCompleto)?.trim() || "";
  const categoriaFiscalId = Number(f.categoriaFiscal || 0);

  return {
    nombre: nombreBase,
    categoriaFiscalId,
    razonSocial: f.razonSocial?.trim() || null,
    nombreComercial: f.nombreFantasia?.trim() || null,
    codigo: f.codigo?.trim() || null,
    genero: f.genero?.trim() || null,
    cuil: f.cuitCuil?.replace(/\D/g, "") || null,
    pais: f.pais?.trim() || null,
    provincia: f.provincia?.trim() || null,
    localidad: f.localidad?.trim() || null,
    barrio: f.barrio?.trim() || null,
    codigoPostal: f.codigoPostal?.trim() || null,
    telefono: f.telefono?.trim() || null,
    paginaWeb: f.paginaWeb?.trim() || null,
    correoElectronico: f.email?.trim() || null,
  };
}

export default function ProveedoresPage() {
  // Estado base
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Cargar desde API (sin cache) y reutilizable
  const fetchProveedores = useCallback(async () => {
    try {
      const res = await fetch("/api/proveedores?status=all", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al cargar proveedores");
      setSuppliers(data.data || []);
    } catch (err) {
      console.error("Error al conectar con la API de proveedores:", err);
    }
  }, []);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

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

  //Para la notificacion
  const [successOpen, setSuccessOpen] = useState(false);
  const [created, setCreated] = useState<any | null>(null);
  
  // Derivados
  const filtered = useMemo(() => filterSuppliers(suppliers, filters), [suppliers, filters]);
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
    // Mantengo el toggle local (no afecta la carga, y es rápido).
    setSuppliers((arr) => arr.map((x) => (x.id === id ? toggleStatus(x) : x)));
  }

  // Crear/Editar contra la API y refrescar desde servidor
  async function handleSubmit(payload: SupplierForm) {
    const isEdit = !!editing;

    // Validaciones mínimas antes de llamar a la API
    const nombreBase =
      (payload.tipo === "empresa" ? payload.razonSocial : payload.nombreCompleto)?.trim() || "";
    if (!nombreBase) {
      alert("Completá el nombre / razón social.");
      return;
    }
    const categoriaFiscalId = Number(payload.categoriaFiscal || 0);
    if (!categoriaFiscalId) {
      alert("Seleccioná una Categoría Fiscal válida.");
      return;
    }

    try {
      if (isEdit && editing?.id) {
        // PUT /api/proveedores/:id/modificar
        const dto = {
          ...formToCreateDTO(payload),
          estado: payload.estado === "Activo", // el updateSchema espera boolean
        };

        const res = await fetch(`/api/proveedores/${editing.id}/modificar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        });
        const json = await res.json();

        if (!res.ok || !json?.ok) {
          if (res.status === 409) alert("Ese CUIT/CUIL ya está registrado.");
          else if (res.status === 422) alert("Revisá los campos del formulario.");
          else alert(json?.error || "No se pudo actualizar el proveedor.");
          return;
        }
        
      } else {
        // POST /api/proveedores
        const dto = formToCreateDTO(payload);

        const res = await fetch("/api/proveedores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        });
        const json = await res.json();

        if (!res.ok || !json?.ok) {
          if (res.status === 409) alert("Ese CUIT/CUIL ya está registrado.");
          else if (res.status === 422) alert("Revisá los campos del formulario.");
          else alert(json?.error || "No se pudo crear el proveedor.");
          return;
        }
        // Cartel de exito
        setOpenModal(false);
        setCreated(json.data);
        setSuccessOpen(true);
        await fetchProveedores();
      }

      setOpenModal(false);
      await fetchProveedores(); // refrescar lista desde el server
    } catch (e) {
      console.error(isEdit ? "Error al actualizar proveedor:" : "Error al crear proveedor:", e);
      alert("Error de red. Intentá de nuevo.");
    }
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
            className="px-8 py-8 rounded-xl gap-3 text-lg hover:shadow-lg"
          >
            <Plus className="w-6 h-6" aria-hidden />
            <span>Nuevo Proveedor</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards total={stats.total} activos={stats.activos} inactivos={stats.inactivos} />

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
        initialData={editing ? supplierToForm(editing) : undefined}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Confirmación de creación */}
      <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogTitle className="text-xl font-bold">Proveedor creado</AlertDialogTitle>

          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {created?.id != null && (
              <div><span className="font-semibold">ID:</span> {created.id}</div>
            )}
            {/* nombre puede venir como nombre, razonSocial o nombreComercial */}
            {(created?.nombre || created?.razonSocial || created?.nombreComercial) && (
              <div>
                <span className="font-semibold">Nombre:</span>{" "}
                {created.nombre ?? created.razonSocial ?? created.nombreComercial}
              </div>
            )}
            {created?.cuil && (
              <div><span className="font-semibold">CUIT/CUIL:</span> {created.cuil}</div>
            )}
            {/* categoriaFiscal puede venir embebida o solo como id */}
            {(created?.categoriaFiscal?.nombre || created?.categoriaFiscalId) && (
              <div>
                <span className="font-semibold">Categoría Fiscal:</span>{" "}
                {created.categoriaFiscal?.nombre ?? `ID ${created.categoriaFiscalId}`}
              </div>
            )}
            {created?.correoElectronico && (
              <div><span className="font-semibold">Email:</span> {created.correoElectronico}</div>
            )}
            {created?.telefono && (
              <div><span className="font-semibold">Teléfono:</span> {created.telefono}</div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSuccessOpen(false)}>
              Cerrar
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

    </main>
  );
}
