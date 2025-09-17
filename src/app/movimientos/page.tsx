// src/app/movimientos/page.tsx
"use client";

import { useEffect, useMemo, useState } from 'react';
import StatsCards from '@/components/movimientos/StatsCards';
import MovimientosFilters, { type FiltersState } from '@/components/movimientos/MovimientosFilters';
import MovimientosTable from '@/components/movimientos/MovimientosTable';
import MovimientosModal, { type MovimientoPayload } from '@/components/movimientos/MovimientosModal';
import MovimientosDetailModal from '@/components/movimientos/MovimientosDetailModal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

import { fetchDepositos, type DepositoDTO } from '@/lib/deposito/data';

import {
  depositosMock,
  getStats,
  type Movimiento,
  type TipoMovimiento,
  type ProductoLite,
} from '@/lib/movimientos/productsData';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ---------------- Types ----------------
type StockRowDTO = {
  id: number;
  depositId: number;
  productId: number;
  depositNombre: string;
  depositUbicacion: string | null;
  productDescripcion: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
};

type StockIndex = Record<number, Record<number, number>>;
type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };

type CreateMovimientoBody = {
  depositoId: number;
  tipoMovimientoId: number;
  tipoComprobanteId: number;
  numeroComprobante?: string;
  comentario?: string;
  detalles: Array<{ productoId: number; cantidad: number }>;
};

// API Response types
type ApiMovimientoItem = {
  detalle_id: number;
  fecha: string;
  numero_comprobante: string | null;
  comentario: string | null;
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

// ---------------- Fetchers ----------------
async function fetchStockTodos(q?: string): Promise<StockRowDTO[]> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  const res = await fetch(`/api/depositos/stock${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener el stock");
  const json = await res.json();
  return json.data as StockRowDTO[];
}

async function fetchTiposMovimientos(): Promise<TipoMovimientoDTO[]> {
  const res = await fetch('/api/tipos-movimientos', { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudieron obtener los tipos de movimiento');
  const json = await res.json();
  return json.data as TipoMovimientoDTO[];
}

// Mapeo de tipos de movimiento de la API a los tipos esperados
const mapTipoMovimiento = (apiTipo: string): TipoMovimiento => {
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
      console.warn(`Tipo de movimiento no reconocido: ${apiTipo}`);
      return 'Ajuste de stock';
  }
};

// Función para obtener movimientos de la API con filtros
const fetchMovimientos = async (filters?: FiltersState): Promise<Movimiento[]> => {
  try {
    const url = new URL('/api/movimientos', window.location.origin);
    
    if (filters) {
      if (filters.fechaDesde) url.searchParams.set('start', filters.fechaDesde);
      if (filters.fechaHasta) url.searchParams.set('end', filters.fechaHasta);
      if (filters.depositoId && filters.depositoId !== '') {
        url.searchParams.set('depositoId', String(filters.depositoId));
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
      
      // Si hay tipo de movimiento específico, también incluirlo en la búsqueda
      if (filters.tipoMovimiento && !filters.q) {
        url.searchParams.set('q', filters.tipoMovimiento);
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

    // Agrupar items por movimiento
    const movimientosMap = new Map<string, Movimiento>();

    result.items.forEach((item) => {
      const key = `${item.fecha}-${item.deposito}-${item.tipo_movimiento}-${item.tipo_comprobante}`;
      
      if (!movimientosMap.has(key)) {
        // Buscar el depósito por nombre para obtener el ID real
        const depositoEncontrado = depositosMock.find(d => d.nombre === item.deposito);
        
        movimientosMap.set(key, {
          id: item.detalle_id,
          fechaISO: item.fecha.split('T')[0],
          movimiento: item.es_ingreso ? 'Ingreso' : 'Egreso',
          tipoMovimiento: mapTipoMovimiento(item.tipo_movimiento),
          comprobanteId: item.numero_comprobante || undefined,
          comentario: item.comentario || undefined,
          deposito: depositoEncontrado || { id: 999, nombre: item.deposito },
          productos: [{
            producto: { id: 0, codigo: '', descripcion: item.producto },
            cantidad: item.cantidad
          }],
        });
      } else {
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
  // ---- Estados principales ----
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Estados para datos reales ----
  const [depositos, setDepositos] = useState<DepositoDTO[]>([]);
  const [loadingDep, setLoadingDep] = useState(false);
  const [errorDep, setErrorDep] = useState<string | null>(null);

  const [tiposMov, setTiposMov] = useState<TipoMovimientoDTO[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errorTipos, setErrorTipos] = useState<string | null>(null);

  const [stock, setStock] = useState<StockRowDTO[]>([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);

  // ---- Estados de modales ----
  const [isModalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Movimiento | null>(null);
  
  // ---- Estados de confirmación ----
  const [successOpen, setSuccessOpen] = useState(false);
  const [created, setCreated] = useState<{
    id: number;
    deposito?: string | null;
    tipo?: string | null;
    numero?: string | null;
  } | null>(null);

  // ---- Filtros ----
  const [filters, setFilters] = useState<FiltersState>({
    fechaDesde: "",
    fechaHasta: "",
    movimiento: "",
    depositoId: "",
    tipoMovimiento: "",
    q: "",
  });

  // ---- Effects para cargar datos ----
  
  // Cargar movimientos
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

  // Cargar depósitos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingDep(true);
        const data = await fetchDepositos();
        if (mounted) setDepositos(data);
      } catch (e: any) {
        if (mounted) setErrorDep(e?.message ?? "Error cargando depósitos");
      } finally {
        if (mounted) setLoadingDep(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Cargar tipos de movimiento
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingTipos(true);
        const data = await fetchTiposMovimientos();
        if (mounted) setTiposMov(data);
      } catch (e: any) {
        if (mounted) setErrorTipos(e?.message ?? 'Error cargando tipos de movimiento');
      } finally {
        if (mounted) setLoadingTipos(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Cargar stock
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingStock(true);
        const data = await fetchStockTodos();
        if (mounted) setStock(data);
      } catch (e: any) {
        if (mounted) setErrorStock(e?.message ?? "Error cargando stock");
      } finally {
        if (mounted) setLoadingStock(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ---- Memos para procesar datos ----
  const stockIndex = useMemo<StockIndex>(() => {
    const idx: StockIndex = {};
    for (const r of stock) {
      if (!idx[r.depositId]) idx[r.depositId] = {};
      idx[r.depositId][r.productId] = r.stockActual;
    }
    return idx;
  }, [stock]);

  const productosPorDeposito: Record<number, ProductoLite[]> = useMemo(() => {
    const map: Record<number, ProductoLite[]> = {};
    for (const row of stock) {
      if (!map[row.depositId]) map[row.depositId] = [];
      const ya = map[row.depositId].some((p) => p.id === row.productId);
      if (!ya) {
        map[row.depositId].push({
          id: row.productId,
          codigo: String(row.productId),
          descripcion: row.productDescripcion,
        });
      }
    }
    return map;
  }, [stock]);

  // Filtrado de movimientos
  const filtered = useMemo(() => {
    return movimientos.filter((m) => {
      const f = filters;

      if (f.fechaDesde && m.fechaISO < f.fechaDesde) return false;
      if (f.fechaHasta && m.fechaISO > f.fechaHasta) return false;
      if (f.movimiento && m.movimiento !== f.movimiento) return false;
      if (f.tipoMovimiento && m.tipoMovimiento !== f.tipoMovimiento) return false;

      if (f.depositoId) {
        const wanted = Number(f.depositoId);
        const isTransfer = m.tipoMovimiento === "Transferencia entre depósitos";
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
        const txt = `${m.comentario ?? ""} ${m.comprobanteId ?? ""}`.toLowerCase();
        if (!txt.includes(q)) return false;
      }

      return true;
    });
  }, [movimientos, filters]);

  const stats = useMemo(() => getStats(filtered), [filtered]);

  // ---- Handlers ----
  const clearFilters = () =>
    setFilters({
      fechaDesde: "",
      fechaHasta: "",
      movimiento: "",
      depositoId: "",
      tipoMovimiento: "",
      q: "",
    });

  const onSearch = async () => {
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
    try {
      if (!p.depositoId) throw new Error('Depósito requerido');
      if (!p.tipoMovimientoId) throw new Error('Tipo de movimiento requerido');
      if (!p.productos?.length) throw new Error('Debe incluir al menos un producto');

      const body: CreateMovimientoBody = {
        depositoId: p.depositoId!,
        tipoMovimientoId: p.tipoMovimientoId!,
        tipoComprobanteId: 2,
        numeroComprobante: p.numeroComprobante || undefined,
        comentario: p.comentario || undefined,
        detalles: p.productos.map(d => ({ productoId: d.productoId, cantidad: Math.abs(d.cantidad) })),
      };

      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo crear el movimiento');

      setModalOpen(false);

      // Recargar movimientos después de crear
      const updatedMovimientos = await fetchMovimientos();
      setMovimientos(updatedMovimientos);

      // Mostrar confirmación
      const d = json.data;
      setCreated({
        id: d.id,
        deposito: d.deposito?.nombre ?? null,
        tipo: d.tipoMovimiento?.nombre ?? null,
        numero: d.numeroComprobante ?? null,
      });
      setSuccessOpen(true);

    } catch (e: any) {
      alert(e.message ?? 'Error al crear movimiento');
    }
  };

  // ---- Render states ----
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

  // ---- Render principal ----
  const modalDepositoId = depositos.length ? depositos[0].id : 0;

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Movimiento de Stock</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent">
            Movimiento de Stock
          </h2>
          <p className="text-gray-600 text-lg">
            {loadingDep || loadingStock || loadingTipos
              ? "Cargando datos…"
              : "Historial completo de ingresos y egresos de inventario"}
          </p>
          {(errorDep || errorStock || errorTipos) && (
            <p className="text-sm text-red-600 mt-2">
              {errorDep ?? errorStock ?? errorTipos}
            </p>
          )}
        </div>

        <div className="flex space x-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreate}
            className="px-8 py-8 rounded-xl gap-3 text-lg hover:shadow-lg"
            disabled={loadingDep || loadingStock || !depositos.length || !tiposMov.length}
          >
            <Plus className="w-10 h-5 mr-2" aria-hidden />
            Registrar Nuevo Movimiento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards total={stats.total} ingresos={stats.ingresos} egresos={stats.egresos} />

      {/* Filtros */}
      <MovimientosFilters
        state={filters}
        onChange={(patch) => setFilters((s) => ({ ...s, ...patch }))}
        depositos={depositos.map((d) => ({ id: d.id, nombre: d.nombre }))}
        onSearch={onSearch}
        onClear={clearFilters}
      />

      {/* Tabla */}
      <MovimientosTable
        data={filtered}
        onViewDetail={(m) => {
          setSelected(m);
          setDetailOpen(true);
        }}
        onNew={handleCreate}
      />

      {/* Modal de creación */}
      <MovimientosModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        depositos={depositos.map((d) => ({ id: d.id, nombre: d.nombre }))}
        productosPorDeposito={productosPorDeposito}
        onSubmit={onSubmitModal}
        initial={{ depositoId: modalDepositoId }}
        stockIndex={stockIndex}
        tiposMovimiento={tiposMov}
      />

      {/* Modal de detalle */}
      <MovimientosDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        movimiento={selected}
      />

      {/* Confirmación de creación */}
      <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogTitle className="text-xl font-bold">Movimiento registrado</AlertDialogTitle>

          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div><span className="font-semibold">ID:</span> {created?.id}</div>
            {created?.numero ? (
              <div><span className="font-semibold">N° Remito:</span> {created.numero}</div>
            ) : null}
            {created?.tipo ? (
              <div><span className="font-semibold">Tipo:</span> {created.tipo}</div>
            ) : null}
            {created?.deposito ? (
              <div><span className="font-semibold">Depósito:</span> {created.deposito}</div>
            ) : null}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSuccessOpen(false)}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  const res = await fetch(`/api/movimientos/${created?.id}`, { cache: 'no-store' });
                  const json = await res.json();
                  if (res.ok && json.ok) {
                    setSelected({
                      id: json.data.id,
                      fechaISO: json.data.fecha?.slice?.(0, 10) ?? '',
                      movimiento: json.data.tipoMovimiento?.saldo ? 'Ingreso' : 'Egreso',
                      tipoMovimiento: json.data.tipoMovimiento?.nombre ?? '',
                      comprobanteId: json.data.numeroComprobante ?? undefined,
                      comentario: json.data.comentario ?? json.data.Comentario ?? undefined,
                      deposito: json.data.deposito
                        ? { id: json.data.deposito.id, nombre: json.data.deposito.nombre }
                        : undefined,
                      productos: (json.data.detalles || []).map((d: any) => ({
                        producto: {
                          id: d.producto.id,
                          codigo: String(d.producto.id),
                          descripcion: d.producto.nombre,
                        },
                        cantidad: d.cantidad,
                      })),
                    });
                    setSuccessOpen(false);
                    setDetailOpen(true);
                  } else {
                    setSuccessOpen(false);
                  }
                } catch {
                  setSuccessOpen(false);
                }
              }}
            >
              Ver detalle
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}