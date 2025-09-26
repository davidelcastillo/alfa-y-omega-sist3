'use client';

import { useMemo, useState } from 'react';
import PagosStatsCards from '@/components/pagos/PagosStatsCards';
import PagosFilters, { PagosFiltersState } from '@/components/pagos/PagosFilters';
import PagosTable from '@/components/pagos/PagosTable';
import PagosModal from '@/components/pagos/PagosModal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import type { SupplierPayment } from '@/mocks/pagos.mock';

type Props = {
  /** ⚠️ MOCK: viene de page.tsx; reemplazar allí cuando haya API */
  initialData: SupplierPayment[];
  /** ⚠️ MOCK: viene de page.tsx; reemplazar allí cuando haya API */
  suppliers: { id: string; name: string }[];
};

// Filtros iniciales (solo UI; no filtra nada aún)
const resetFilters: PagosFiltersState = {
  fechaDesde: '',
  fechaHasta: '',
  numeroFactura: '',
  // SearchableSelect usa id numérico → temporal hasta DB real
  proveedorId: 0,
};

export default function PagosClient({ initialData, suppliers }: Props) {
  // Estado local de filtros (solo para mostrar el componente; NO se aplica a la data)
  const [filters, setFilters] = useState<PagosFiltersState>(resetFilters);

  // Data mostrada tal cual (sin filtrar/ordenar/paginar)
  const data = initialData;

  // Métricas básicas (sobre la data sin filtrar)
  const totalPagos = data.length;
  const totalPagado = useMemo(
    () => data.reduce((s, p) => s + (p.payment ?? 0), 0),
    [data]
  );

  // Opciones para el SearchableSelect de proveedores (numéricas para UI)
  const proveedoresOptions = useMemo(
    () => suppliers.map((s, idx) => ({ id: idx + 1, nombre: s.name })),
    [suppliers]
  );

  // Estado del modal
  const [modalOpen, setModalOpen] = useState(false);

  // Acciones
  const onOpenNew = () => {
    setModalOpen(true);
  };

  const onView = (id: string) => {
    window.location.href = `/pagos/${id}/detalles`;
  };

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Pago a Proveedores</span>
      </div>

      {/* Header de la sección */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Gestión de Pagos a Proveedores
          </h2>
          <p className="text-gray-600 text-lg">Administra y controla todos los pagos a proveedores</p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="primary"
            size="lg"
            className="px-8 py-8 rounded-xl gap-3 text-lg hover:shadow-lg"
            onClick={onOpenNew}
          >
            <Plus className="w-10 h-5 mr-2" aria-hidden />
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Stats (sin lógica de back) */}
      <PagosStatsCards totalPagos={totalPagos} totalPagado={totalPagado} />

      {/* Filtros (solo UI; no aplica filtros aún) */}
      <PagosFilters
        initial={filters}
        proveedores={proveedoresOptions}           // ⚠️ En prod: vendrá directo de DB
        onSearch={() => { /* sin-op: se aplicará cuando haya backend */ }}
        onClear={() => setFilters(resetFilters)}  // solo limpia UI
      />

      {/* Tabla (sin sort/paginación) */}
      <PagosTable data={data} onView={onView} />

      {/* Modal de nueva orden de pago */}
      <PagosModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {
          // Recargar la página para ver los cambios
          window.location.reload();
        }}
      />
    </main>
  );
}