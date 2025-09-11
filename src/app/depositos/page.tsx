'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import StatsCards from '@/components/depositos/StatsCards'
import Filters from '@/components/depositos/Filters'
import DepositsTable from '@/components/depositos/DepositsTable'
import DepositModal from '@/components/depositos/DepositModal'
import Button from '@/components/ui/Button'
import type { Deposito } from '@/lib/deposito/types'
import type { SortKey, SortOrder } from '@/lib/types'
import Link from 'next/link'
import { softDeleteDeposito } from '@/lib/api'

// ---

type FiltersState = {
  search: string
  tipo: '' | 'Principal' | 'Sucursal' | 'Temporal' | 'Tránsito'
  estado: '' | 'Activo' | 'Inactivo'
}

const DEFAULT_FILTERS: FiltersState = { search: '', tipo: '', estado: '' }
const PAGE_SIZE = 10

// Lógica de ordenamiento para depósitos
const sortDeposits = (deposits: Deposito[], sortKey: SortKey | null, sortOrder: SortOrder) => {
  if (!sortKey || !sortOrder) return deposits;
  return [...deposits].sort((a, b) => {
    const aValue = a[sortKey as keyof Deposito] as unknown;
    const bValue = b[sortKey as keyof Deposito] as unknown;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });
};

// ---

export default function DepositosPage() {
  const [deposits, setDeposits] = useState<Deposito[]>([]);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Deposito | null>(null);

  // Estados para el modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [depositoToEdit, setDepositoToEdit] = useState<Deposito | null>(null);

  // Estado para el ordenamiento
  const [sortState, setSortState] = useState<{ key: SortKey | null; order: SortOrder }>({ key: 'id', order: 'asc' });

  // Estado y efectos para la paginación
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [filters, sortState]);

  // Lógica para manejar el clic en el encabezado de la tabla
  const handleSort = useCallback((key: SortKey) => {
    setSortState(prev => {
      if (prev.key === key) {
        if (prev.order === 'asc') {
          return { key, order: 'desc' };
        } else {
          return { key: 'id', order: 'asc' };
        }
      } else {
        return { key, order: 'asc' };
      }
    });
  }, []);

  // Cargar depósitos desde el backend
  async function loadDeposits() {
    try {
      const res = await fetch("/api/deposito", { cache: 'no-store' });
      const json = await res.json();

      if (!json?.ok || !Array.isArray(json.data)) {
        setDeposits([]);
        return;
      }

      const mapped: Deposito[] = json.data.map((d: any) => ({
        id: Number(d.id),
        nombre: d.nombre ?? '',
        provincia: d.provincia ?? '',
        ciudad: d.ciudad ?? '',
        ubicacion: d.ubicacion ?? '',
        tipo: (d.tipo ?? 'Principal') as Deposito['tipo'],
        capacidad: d.capacidad ?? null,
        itemsStock: Number(d.itemsStock ?? 0),
        estado: (d.estado ? 'Activo' : 'Inactivo') as 'Activo' | 'Inactivo',
        descripcion: d.descripcion ?? '',
      }));

      setDeposits(mapped);
    } catch (e) {
      console.error('Error al cargar depósitos:', e);
      setDeposits([]);
    }
  }

  useEffect(() => {
    loadDeposits();
  }, []);

  // Lógica de filtrado y ordenamiento combinada
  const filteredAndSorted = useMemo(() => {
    const q = filters.search.toLowerCase();
    const filtered = deposits.filter(d => {
      const bySearch = !q || [d.nombre, d.ubicacion, d.ciudad, d.provincia].some(s => (s ?? '').toLowerCase().includes(q));
      const byTipo = !filters.tipo || d.tipo === filters.tipo;
      const byEstado = !filters.estado || d.estado === filters.estado;
      return bySearch && byTipo && byEstado;
    });
    return sortDeposits(filtered, sortState.key, sortState.order);
  }, [deposits, filters, sortState]);

  // Lógica de paginación
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, totalItems);
  const pageItems = filteredAndSorted.slice(start, end);

  // Función para manejar el clic en "Editar" y mostrar la confirmación
  function onEdit(id: number) {
    const dep = deposits.find(d => d.id === id) ?? null;
    if (dep) {
      setDepositoToEdit(dep);
      setShowConfirm(true);
    }
  }

  // Función que se ejecuta al confirmar la edición en el modal
  function handleConfirmEdit() {
    if (depositoToEdit) {
      setEditing(depositoToEdit);
      setOpen(true);
      setShowConfirm(false);
      setDepositoToEdit(null);
    }
  }

  async function onDelete(id: number) {
    try {
      await softDeleteDeposito(id); //deshabilita
      await loadDeposits();  //refresca la pagina
    } catch (e: any) {
      console.error('Error eliminando depósito:', e);
      alert(e?.message ?? 'No se pudo eliminar el depósito');
    }
  }

  async function onSave(payload: Omit<Deposito, 'id'> & { id?: number }) {
  try {
    if (payload.id) {
      // UPDATE: si tu endpoint de actualización espera boolean, dejamos el boolean acá
      const estadoBoolean = payload.estado === 'Activo'
      const updatePayload = {
        ...payload,
        estado: estadoBoolean,
        capacidad:
          payload.capacidad === '' || payload.capacidad == null
            ? undefined
            : Number(payload.capacidad),
        // limpia strings vacíos
        provincia: payload.provincia?.trim() || undefined,
        ciudad: payload.ciudad?.trim() || undefined,
      }

      await fetch(`/api/deposito/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      })
    } else {
      // CREATE: el endpoint /nuevo espera estado como 'Activo' | 'Inactivo'
      const createPayload = {
        ...payload,
        estado: payload.estado, // 👈 string, NO boolean
        capacidad:
          payload.capacidad === '' || payload.capacidad == null
            ? undefined
            : Number(payload.capacidad), // si es vacío, no mandes nada
        provincia: payload.provincia?.trim() || undefined, // '' => undefined
        ciudad: payload.ciudad?.trim() || undefined,       // '' => undefined
      }

      const res = await fetch('/api/deposito/nuevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createPayload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? 'Error al guardar el depósito')
    }

    await loadDeposits()
    setOpen(false)
    setEditing(null)
  } catch (error: any) {
    console.error('Error guardando depósito:', error)
    alert(error.message ?? 'No se pudo guardar el depósito')
  }
}


  return (
    <main className="max-w-7xl mx-auto px-6 py-8 fade-in">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Depósito</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Gestión de Depósitos
          </h2>
          <p className="text-gray-600 text-lg">Administra tus depósitos y controla el stock por ubicación</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => { setEditing(null); setOpen(true); }}
            className="btn-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Nuevo Depósito</span>
          </button>

          <Link
            href="/depositos/stock"
            className="bg-gradient-to-r from-primary-blue to-dark-blue text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 text-lg hover:shadow-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Gestionar Stock</span>
          </Link>
        </div>
      </div>

      <StatsCards deposits={filteredAndSorted} />

      <Filters
        value={filters}
        onChange={setFilters}
        onApply={() => {}}
      />

      <DepositsTable
        deposits={pageItems}
        onEdit={onEdit}
        onDelete={onDelete}
        onSort={handleSort}
        sortState={sortState}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-gray-600 font-medium">
          {totalItems === 0 ? (
            <>Mostrando <span className="font-bold text-primary-pink">0</span> de <span className="font-bold text-primary-pink">0</span> depósitos</>
          ) : (
            <>Mostrando <span className="font-bold text-primary-pink">{start + 1}-{end}</span> de <span className="font-bold text-primary-pink">{totalItems}</span> depósitos</>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page <= 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700 px-2">
            Página <span className="font-semibold">{Math.min(page, totalPages)}</span> de <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page >= totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {showConfirm && depositoToEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirmar Edición</h3>
            <p className="text-gray-700 mb-6">¿Estás seguro de que quieres modificar el depósito <span className="font-bold text-gray-900">{depositoToEdit.nombre}</span>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => { setShowConfirm(false); setDepositoToEdit(null); }}
                className="btn-outline border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-100"
              >
                Cancelar
              </button>
              <Button
                onClick={handleConfirmEdit}
                //className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-colors hover:shadow-lg"
                className="px-8"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      <DepositModal
        open={open}
        deposito={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={onSave}
      />
    </main>
  );
}