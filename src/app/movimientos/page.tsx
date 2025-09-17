// src/app/movimientos/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import StatsCards from '@/components/movimientos/StatsCards';
import MovimientosFilters, { type FiltersState } from '@/components/movimientos/MovimientosFilters';
import MovimientosTable from '@/components/movimientos/MovimientosTable';
import MovimientosModal, { type MovimientoPayload } from '@/components/movimientos/MovimientosModal';
import MovimientosDetailModal from '@/components/movimientos/MovimientosDetailModal';
import { Plus } from 'lucide-react'

import {
  depositosMock,
  productosLiteMock,
  getStats,
  type Movimiento,
  type TipoMovimiento,
} from '@/lib/movimientos/productsData';

import Button from '@/components/ui/Button';

// Tipos para los datos de la API /api/movimientos
type ApiMovimientoItem = {
  detalle_id: number;
  fecha: string;
  deposito: string;
  tipo_movimiento: string;
  es_ingreso: boolean;
  tipo_comprobante: string;
  producto: string;
  rubro: string;
  unidad: string;
  marca: string;
  cantidad: number;
};

type ApiResponse = {
  updatedAt: string;
  range: { start: string; end: string };
  pageSize: number;
  orderBy: string;
  dir: string;
  hasMore: boolean;
  nextCursor: string | null;
  items: ApiMovimientoItem[];
};

// Mapeo de tipos de movimiento de la API a los tipos esperados
const mapTipoMovimiento = (apiTipo: string): TipoMovimiento => {
  // Mapear exactamente los nombres que vienen de la API a los tipos definidos
  switch (apiTipo) {
    case 'Transferencia entre depósitos':
      return 'Transferencia entre depósitos';
    case 'Compra de inventario':
      return 'Compra de inventario';
    case 'Venta de inventario':
      return 'Venta de inventario';
    case 'Ajuste de stock':
      return 'Ajuste de stock';
    default:
      // Si viene un tipo no reconocido, usar uno por defecto
      console.warn(`Tipo de movimiento no reconocido: ${apiTipo}`);
      return 'Ajuste de stock';
  }
};

// Función para obtener movimientos de la API con filtros
const fetchMovimientos = async (filters?: FiltersState): Promise<Movimiento[]> => {
  try {
    // Construir URL con parámetros de filtro
    const url = new URL('/api/movimientos', window.location.origin);
    
    if (filters) {
      // Mapear filtros del componente a parámetros de la API
      if (filters.fechaDesde) url.searchParams.set('start', filters.fechaDesde);
      if (filters.fechaHasta) url.searchParams.set('end', filters.fechaHasta);
      if (filters.depositoId) url.searchParams.set('depositoId', filters.depositoId);
      
      // Mapear tipo de movimiento si existe
      if (filters.tipoMovimiento) {
        // Necesitarías un mapeo de nombres a IDs, por ahora busco por nombre en la query
        url.searchParams.set('q', filters.tipoMovimiento);
      }
      
      // Filtro de ingreso/egreso
      if (filters.movimiento === 'Ingreso') {
        url.searchParams.set('esIngreso', 'true');
      } else if (filters.movimiento === 'Egreso') {
        url.searchParams.set('esIngreso', 'false');
      }
      
      // Búsqueda general
      if (filters.q) {
        url.searchParams.set('q', filters.q);
      }
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const result: ApiResponse = await response.json();
    
    if (!result.items) {
      throw new Error('Respuesta inválida de la API');
    }

    // Agrupar items por movimiento (mismo detalle_id indica el mismo movimiento base)
    // Pero la API parece devolver una fila por cada producto en el movimiento
    // Para la tabla de historial, necesitamos convertir esto a movimientos únicos
    const movimientosMap = new Map<string, Movimiento>();

    result.items.forEach((item, index) => {
      // Usar fecha + deposito + tipo_movimiento como clave única para agrupar
      const key = `${item.fecha}-${item.deposito}-${item.tipo_movimiento}-${item.tipo_comprobante}`;
      
      if (!movimientosMap.has(key)) {
        // Buscar el depósito por nombre para obtener el ID real
        const depositoEncontrado = depositosMock.find(d => d.nombre === item.deposito);
        
        // Crear nuevo movimiento
        movimientosMap.set(key, {
          id: item.detalle_id, // Usar detalle_id como ID temporal
          fechaISO: item.fecha.split('T')[0], // Extraer solo la fecha
          movimiento: item.es_ingreso ? 'Ingreso' : 'Egreso',
          tipoMovimiento: mapTipoMovimiento(item.tipo_movimiento),
          comprobanteId: undefined, 
          comentario: undefined, 
          deposito: depositoEncontrado || { id: 999, nombre: item.deposito }, // Usar ID real o temporal
          productos: [{
            producto: { id: 0, codigo: '', descripcion: item.producto },
            cantidad: item.cantidad
          }],
        });
      } else {
        // Agregar producto al movimiento existente
        const movimiento = movimientosMap.get(key)!;
        movimiento.productos.push({
          producto: { id: 0, codigo: '', descripcion: item.producto },
          cantidad: item.cantidad
        });
      }
    });

    return Array.from(movimientosMap.values());
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return [];
  }
};

export default function MovimientosPage() {
  // ---- data base
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // detalle
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Movimiento | null>(null);

  // ---- filtros
  const [filters, setFilters] = useState<FiltersState>({
    fechaDesde: '',
    fechaHasta: '',
    movimiento: '',
    depositoId: '',
    tipoMovimiento: '',
    q: '',
  });

  // Cargar movimientos al montar el componente
  useEffect(() => {
    const loadMovimientos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchMovimientos();
        setMovimientos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error cargando movimientos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovimientos();
  }, []);

  const clearFilters = () =>
    setFilters({ fechaDesde: '', fechaHasta: '', movimiento: '', depositoId: '', tipoMovimiento: '', q: '' });

  // ---- filtrado
  const filtered = useMemo(() => {
    return movimientos.filter((m) => {
      const f = filters;

      if (f.fechaDesde && m.fechaISO < f.fechaDesde) return false;
      if (f.fechaHasta && m.fechaISO > f.fechaHasta) return false;

      if (f.movimiento && m.movimiento !== f.movimiento) return false;
      if (f.tipoMovimiento && m.tipoMovimiento !== f.tipoMovimiento) return false;

      if (f.depositoId) {
        const wanted = Number(f.depositoId);
        const isTransfer = m.tipoMovimiento === 'Transferencia entre depósitos';
        if (isTransfer) {
          const hit =
            (m.depositoOrigen && m.depositoOrigen.id === wanted) ||
            (m.depositoDestino && m.depositoDestino.id === wanted);
          if (!hit) return false;
        } else {
          if (!m.deposito || m.deposito.id !== wanted) return false;
        }
      }

      if (f.q) {
        const q = f.q.toLowerCase();
        const txt = `${m.comentario ?? ''} ${m.comprobanteId ?? ''}`.toLowerCase();
        if (!txt.includes(q)) return false;
      }

      return true;
    });
  }, [movimientos, filters]);

  const stats = useMemo(() => getStats(filtered), [filtered]);

  // ---- handlers
  const onSearch = async () => {
    // Hacer nueva búsqueda con los filtros actuales
    setLoading(true);
    try {
      const data = await fetchMovimientos(filters);
      setMovimientos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = () => setModalOpen(true);

  const onSubmitModal = async (p: MovimientoPayload) => {
    // Aquí deberías llamar a la API para crear el nuevo movimiento
    // y luego recargar la lista o agregarlo al estado local
    try {
      // Ejemplo de llamada a API (ajusta según tu implementación)
      const response = await fetch('/api/movimientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(p),
      });

      if (response.ok) {
        // Recargar movimientos después de crear uno nuevo
        const updatedMovimientos = await fetchMovimientos();
        setMovimientos(updatedMovimientos);
        setModalOpen(false);
      } else {
        console.error('Error al crear movimiento');
      }
    } catch (error) {
      console.error('Error al crear movimiento:', error);
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando movimientos...</p>
          </div>
        </div>
      </main>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600">Error al cargar movimientos: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90"
            >
              Reintentar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Movimiento de Stock</span>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent">
            Movimiento de Stock
          </h2>
          <p className="text-gray-600 text-lg">Historial completo de ingresos y egresos de inventario</p>
        </div>
        <div className="flex space x-4">
          <Button variant="primary" size="lg" onClick={handleCreate} className="px-8 py-8 rounded-xl gap-3 text-lg hover:shadow-lg">
            <Plus className="w-10 h-5 mr-2" aria-hidden />
            Registrar Nuevo Movimiento
          </Button>
        </div>
      </div>

      <StatsCards total={stats.total} ingresos={stats.ingresos} egresos={stats.egresos} />

      <MovimientosFilters
        state={filters}
        onChange={(patch) => setFilters((s) => ({ ...s, ...patch }))}
        depositos={depositosMock}
        onSearch={onSearch}
        onClear={clearFilters}
      />

      <MovimientosTable
        data={filtered}
        onViewDetail={(m) => {
          setSelected(m);
          setDetailOpen(true);
        }}
        onNew={handleCreate}
      />

      {/* Crear */}
      <MovimientosModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        depositos={depositosMock}
        productos={productosLiteMock}
        onSubmit={onSubmitModal}
      />

      {/* Detalle */}
      <MovimientosDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        movimiento={selected}
      />
    </main>
  );
}