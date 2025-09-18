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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Tipos y fetchers de la API
import {
  fetchDepositos,
  type DepositoDTO
} from '@/lib/deposito/data';
import {
  getStats,
  type Movimiento,
  type TipoMovimiento,
  type ProductoLite,
} from '@/lib/movimientos/productsData';

// ---------------- Tipos y Fetchers de API ----------------
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
type ApiMovimientoItem = {
  detalle_id: number;
  mov_id: number;
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
  comentario?: string;
  numeroComprobante?: string;
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
type MovimientoDetalleAPI = {
  ok: true;
  data: {
    movimiento: {
      id: number;
      fecha: string;
      hora: string;
      numeroComprobante: string | null;
      comentario?: string | null;
      deposito: { id: number; nombre: string };
      tipoMovimiento: { id: number; nombre: string; saldo: boolean };
      tipoComprobante: { id: number; nombre: string };
    };
    summary: { totalLineas: number; totalIngreso: number; totalEgreso: number; neto: number };
    items: Array<{
      detalleId: number;
      stockId: number;
      productoId: number;
      producto: string;
      unidad: string | null;
      marca: string | null;
      rubro: string | null;
      cantidad: number;
      signo: 1 | -1;
      stockAntes: number;
      stockDespues: number;
      stockMinimo: number;
      stockMaximo: number | null;
      estado: "OK" | "BELOW_MIN" | "AT_ZERO" | "OVER_MAX";
    }>;
  };
};

// Para la hora
function toHHMM(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (!Number.isNaN(d.getTime())) {
    return new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  }
  const s = String(input);
  const m = s.match(/^(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : '';
}


async function fetchMovimientoDetalle(id: number): Promise<MovimientoDetalleAPI['data']> {
  const res = await fetch(`/api/movimientos/${id}/detalles`, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo cargar el detalle');
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Error de API');
  return json.data;
}

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
    case 'Egreso por Ajuste':
      return 'Egreso por Ajuste';
    case 'Egreso por Obsolencia':
      return 'Egreso por Obsolencia';
    case 'Egreso por Venta':
      return 'Egreso por Venta';
    case 'Ingreso por Ajuste':
      return 'Ingreso por Ajuste';
    case 'Ingreso por Compra':
      return 'Ingreso por Compra';
    case 'Ingreso por Devolución':
      return 'Ingreso por Devolución';
    default:
      console.warn(`Tipo de movimiento no reconocido: ${apiTipo}`);
      return 'Ajuste de stock';
  }
};

// Carga de movimientos desde API
const fetchMovimientos = async (filters?: FiltersState, depositos?: DepositoDTO[]): Promise<Movimiento[]> => {
  try {
    const url = new URL('/api/movimientos', window.location.origin);
    if (filters) {
      if (filters.fechaDesde) url.searchParams.set('start', filters.fechaDesde);
      if (filters.fechaHasta) url.searchParams.set('end', filters.fechaHasta);
      const depId = Number(filters.depositoId);
      if (Number.isFinite(depId) && depId > 0) {
        url.searchParams.set('depositoId', String(depId));
      }
      if (filters.movimiento === 'Ingreso') {
        url.searchParams.set('esIngreso', 'true');
      } else if (filters.movimiento === 'Egreso') {
        url.searchParams.set('esIngreso', 'false');
      }
      if (filters.q) {
        url.searchParams.set('q', filters.q);
      }
      if (filters.tipoMovimiento && !filters.q) {
        url.searchParams.set('q', filters.tipoMovimiento);
      }
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result: ApiResponse = await response.json();
    if (!result.items) throw new Error('Respuesta inválida de la API');

    // Mapa nombre -> id de depósito
    const depositoMap = new Map<string, number>();
    depositos?.forEach(dep => depositoMap.set(dep.nombre, dep.id));

    const movimientosMap = new Map<number, Movimiento>();
    result.items.forEach((item) => {
      if (!movimientosMap.has(item.mov_id)) {
        const depositoId = depositoMap.get(item.deposito) || 0;
        movimientosMap.set(item.mov_id, {
          id: item.mov_id,
          fechaISO: item.fecha.split('T')[0],
          //hora: item.fecha.split('T')[1]?.slice(0, 5) ?? '00:00',
          hora: toHHMM(item.fecha),
          movimiento: item.es_ingreso ? 'Ingreso' : 'Egreso',
          tipoMovimiento: mapTipoMovimiento(item.tipo_movimiento),
          comprobanteId: item.numeroComprobante,
          comentario: item.comentario,
          deposito: { id: depositoId, nombre: item.deposito },
          productos: [],
        });
      }
      const movimiento = movimientosMap.get(item.mov_id)!;
      movimiento.productos.push({
        producto: { id: 0, codigo: '', descripcion: item.producto },
        cantidad: item.cantidad,
      });
    });
    return Array.from(movimientosMap.values());
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return [];
  }
};

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [depositos, setDepositos] = useState<DepositoDTO[]>([]);
  const [loadingDep, setLoadingDep] = useState(false);
  const [errorDep, setErrorDep] = useState<string | null>(null);

  const [tiposMov, setTiposMov] = useState<TipoMovimientoDTO[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errorTipos, setErrorTipos] = useState<string | null>(null);

  const [stock, setStock] = useState<StockRowDTO[]>([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Movimiento | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [created, setCreated] = useState<{
    id: number;
    deposito?: string | null;
    tipo?: string | null;
    numero?: string | null;
  } | null>(null);

  const [filters, setFilters] = useState<FiltersState>({
    fechaDesde: "",
    fechaHasta: "",
    movimiento: "",
    depositoId: "",
    tipoMovimiento: "",
    q: "",
  });

  const reloadMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovimientos(filters, depositos);
      setMovimientos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando movimientos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadAllData = async () => {
      setLoadingDep(true);
      setLoadingTipos(true);
      setLoadingStock(true);
      setLoading(true);
      try {
        const [depData, tiposData, stockData] = await Promise.all([
          fetchDepositos(),
          fetchTiposMovimientos(),
          fetchStockTodos(),
        ]);
        if (mounted) {
          setDepositos(depData);
          setTiposMov(tiposData);
          setStock(stockData);

          const movData = await fetchMovimientos(filters, depData);
          setMovimientos(movData);
        }
      } catch (e: any) {
        if (mounted) {
          setErrorDep(e?.message ?? "Error cargando depósitos");
          setErrorTipos(e?.message ?? "Error cargando tipos de movimiento");
          setErrorStock(e?.message ?? "Error cargando stock");
          setError(e?.message ?? "Error cargando movimientos");
        }
      } finally {
        if (mounted) {
          setLoadingDep(false);
          setLoadingTipos(false);
          setLoadingStock(false);
          setLoading(false);
        }
      }
    };
    loadAllData();
    return () => { mounted = false; };
  }, []); // Solo al montar

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

  const modalDepositoId = depositos.length ? depositos[0].id : 0;

  const clearFilters = () => setFilters({
    fechaDesde: "",
    fechaHasta: "",
    movimiento: "",
    depositoId: "",
    tipoMovimiento: "",
    q: "",
  });

  const onSearch = async () => {
    await reloadMovimientos();
  };

  const handleCreate = () => setModalOpen(true);

  // ✅ Sin transferencias: exige un único depósito y arma body simple
  const onSubmitModal = async (p: MovimientoPayload) => {
    try {
      if (!p.depositoId) throw new Error('Depósito requerido');
      if (!p.tipoMovimientoId) throw new Error('Tipo de movimiento requerido');
      if (!p.productos?.length) throw new Error('Debe incluir al menos un producto');

      const body: CreateMovimientoBody = {
        depositoId: p.depositoId,
        tipoMovimientoId: p.tipoMovimientoId,
        tipoComprobanteId: 2,
        numeroComprobante: p.numeroComprobante || undefined,
        comentario: p.comentario || undefined,
        detalles: p.productos.map(d => ({
          productoId: d.productoId,
          cantidad: Math.abs(d.cantidad),
        })),
      };

      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo crear el movimiento');

      setModalOpen(false);
      await reloadMovimientos();

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

  const filtered = useMemo(() => {
    return movimientos.filter((m) => {
      const f = filters;
      if (f.fechaDesde && m.fechaISO < f.fechaDesde) return false;
      if (f.fechaHasta && m.fechaISO > f.fechaHasta) return false;
      if (f.movimiento && m.movimiento !== f.movimiento) return false;
      if (f.tipoMovimiento && m.tipoMovimiento !== f.tipoMovimiento) return false;
      if (f.depositoId) {
        const wanted = Number(f.depositoId);
        if (!m.deposito || m.deposito.id !== wanted) return false;
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

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize;
  const end = totalItems === 0 ? 0 : Math.min(start + pageSize, totalItems);
  const pageData = useMemo(() => filtered.slice(start, end), [filtered, start, end]);

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

        <div className="flex space-x-4">
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
        tiposMovimiento={tiposMov}
        onSearch={onSearch}
        onClear={clearFilters}
      />

      {/* Tabla */}
      <MovimientosTable
        data={pageData}
        onViewDetail={async (m: Movimiento) => {
          try {
            const det = await fetchMovimientoDetalle(m.id);
            const movimientoDet: Movimiento = {
              id: det.movimiento.id,
              fechaISO: det.movimiento.fecha.slice(0, 10),
              //hora: det.movimiento.hora,
              hora: toHHMM(`${det.movimiento.fecha}T${det.movimiento.hora}`),
              movimiento: det.movimiento.tipoMovimiento.saldo ? 'Ingreso' : 'Egreso',
              tipoMovimiento: mapTipoMovimiento(det.movimiento.tipoMovimiento.nombre),
              comprobanteId: det.movimiento.numeroComprobante ?? undefined,
              comentario: det.movimiento.comentario ?? undefined,
              deposito: { id: det.movimiento.deposito.id, nombre: det.movimiento.deposito.nombre },
              productos: det.items.map((it) => ({
                producto: { id: it.productoId, codigo: '', descripcion: it.producto },
                cantidad: it.cantidad,
              })),
            };
            setSelected(movimientoDet);
            setDetailOpen(true);
          } catch (e: any) {
            alert(e.message || 'Error cargando detalle');
          }
        }}
        onNew={handleCreate}
      />

      {/* Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-gray-600 font-medium">
          {totalItems === 0 ? (
            <>Mostrando <span className="font-bold text-primary-pink">0</span> de <span className="font-bold text-primary-pink">0</span> movimientos</>
          ) : (
            <>Mostrando <span className="font-bold text-primary-pink">{start + 1}-{end}</span> de <span className="font-bold text-primary-pink">{totalItems}</span> movimientos</>
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

      {/* Confirmación creación */}
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
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
