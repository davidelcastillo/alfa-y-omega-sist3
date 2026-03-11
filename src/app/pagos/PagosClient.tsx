'use client';

import { useMemo, useState } from 'react';
import PagosStatsCards from '@/components/pagos/PagosStatsCards';
import PagosFilters, { PagosFiltersState } from '@/components/pagos/PagosFilters';
import PagosTable from '@/components/pagos/PagosTable';
import PagosModal from '@/components/pagos/PagosModal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import type { SupplierPayment } from '@/mocks/pagos.mock';
import { apiListOrdenesPago } from '@/lib/ordenes-pago/api';

type Props = {
  initialData: SupplierPayment[];
  suppliers: { id: string; name: string }[];
};

const resetFilters: PagosFiltersState = {
  fechaDesde: '',
  fechaHasta: '',
  numeroFactura: '',
  proveedorId: 0,
};

export default function PagosClient({ initialData, suppliers }: Props) {
  const [filters, setFilters] = useState<PagosFiltersState>(resetFilters);
  const [data, setData] = useState<SupplierPayment[]>(initialData);
  const [loading, setLoading] = useState(false);

  // Métricas básicas
  const totalPagos = data.length;
  const totalPagado = useMemo(
    () => data.reduce((s, p) => s + (p.payment ?? 0), 0),
    [data]
  );

  // Opciones para el SearchableSelect de proveedores
  const proveedoresOptions = useMemo(
    () => suppliers.map((s) => ({ id: Number(s.id), nombre: s.name })),
    [suppliers]
  );

  // Estado del modal
  const [modalOpen, setModalOpen] = useState(false);

  // Función para buscar con filtros
  const handleSearch = async (filterState: PagosFiltersState) => {
    setLoading(true);
    try {
      // Construir parámetros para la API
      const params: any = {
        limit: 100,
        sort: '-fecha',
      };

      if (filterState.fechaDesde) {
        params.fecha_desde = filterState.fechaDesde;
      }
      if (filterState.fechaHasta) {
        params.fecha_hasta = filterState.fechaHasta;
      }
      if (filterState.numeroFactura && filterState.numeroFactura.trim()) {
        params.search = filterState.numeroFactura.trim();
      }
      if (filterState.proveedorId && filterState.proveedorId > 0) {
        params.proveedorId = filterState.proveedorId;
      }

      // Llamar a la API
      const response = await apiListOrdenesPago(params);

      // Mapear resultados al formato de la tabla
      const mappedData: SupplierPayment[] = response.items.map((item) => {
        const supplier = suppliers.find(s => s.id === item.proveedor.id.toString());
        
        let status: 'Pendiente de pago' | 'Pagado' | 'Vencido' = 'Pendiente de pago';
        if (!item.estado) {
          status = 'Vencido';
        } else if (item.estado_pago === 'completo') {
          status = 'Pagado';
        }

        const fecha = new Date(item.fecha);
        const registrationDate = fecha.toISOString().replace('T', ' ').substring(0, 19);
        const dateOnly = fecha.toISOString().split('T')[0];

        return {
          id: item.id.toString(),
          paymentId: item.nro_interno || `PAG-${item.id.toString().padStart(3, '0')}`,
          registrationDate,
          invoiceCode: item.nro_interno || `OP-${item.id}`,
          purchaseOrderNumber: `OC-${item.id.toString().padStart(3, '0')}`,
          paymentDueDate: dateOnly,
          dueDate: dateOnly,
          supplier: {
            id: item.proveedor.id.toString(),
            name: item.proveedor.nombre,
            code: supplier?.id || `PROV${item.proveedor.id.toString().padStart(3, '0')}`,
          },
          total: item.total_pagado,
          payment: item.estado_pago === 'completo' ? item.total_pagado : 0,
          balance: item.saldo_restante_total,
          comment: `${item.comprobantes_afectados} comprobante(s) afectado(s)`,
          status,
          paymentCompleteDate: item.estado_pago === 'completo' ? dateOnly : undefined,
          paymentMethod: (item.metodo_pago?.nombre as any) || 'Transferencia',
          voucherType: 'FAC',
          voucherNumber: item.nro_interno || `OP-${item.id}`,
          products: [],
          history: [
            {
              date: registrationDate.substring(0, 16),
              action: 'Orden de pago registrada',
              user: 'Sistema',
            },
          ],
          partialPayments: [],
        };
      });

      setData(mappedData);
      setFilters(filterState);
    } catch (error) {
      console.error('Error al buscar pagos:', error);
      alert('Error al buscar pagos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar filtros
  const handleClear = async () => {
    setFilters(resetFilters);
    await handleSearch(resetFilters);
  };

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

      {/* Stats */}
      <PagosStatsCards totalPagos={totalPagos} totalPagado={totalPagado} />

      {/* Filtros con búsqueda real */}
      <PagosFilters
        initial={filters}
        proveedores={proveedoresOptions}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center py-4 text-gray-600">
          Cargando pagos...
        </div>
      )}

      {/* Tabla */}
      {!loading && <PagosTable data={data} onView={onView} />}

      {/* Modal de nueva orden de pago */}
      <PagosModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {
          // Recargar datos después de crear una orden
          handleSearch(filters);
        }}
      />
    </main>
  );
}