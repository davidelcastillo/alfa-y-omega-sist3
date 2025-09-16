// src/app/movimientos/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import StatsCards from "@/components/movimientos/StatsCards";
import MovimientosFilters, { type FiltersState } from "@/components/movimientos/MovimientosFilters";
import MovimientosTable from "@/components/movimientos/MovimientosTable";
import MovimientosModal, { type MovimientoPayload } from "@/components/movimientos/MovimientosModal";
import MovimientosDetailModal from "@/components/movimientos/MovimientosDetailModal";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

import { fetchDepositos, type DepositoDTO } from "@/lib/deposito/data";

// Mocks SOLO para la tabla y stats (hasta conectar /api/movimientos GET)
import {
  movimientosMock,
  getStats,
  type Movimiento,
  type ProductoLite,
} from "@/lib/movimientos/productsData";

// ---------------- Fetchers de STOCK ----------------
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

type StockIndex = Record<number, Record<number, number>>;  //Para mostrar el stockxdeposito
type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };  //Para traer los movimientos

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

export default function MovimientosPage() {
  // ---- movimientos (mock hasta que conectes GET /api/movimientos)
  const [movimientos, setMovimientos] = useState<Movimiento[]>(movimientosMock);
  //Para los tipos de movimientos
  const [tiposMov, setTiposMov] = useState<TipoMovimientoDTO[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errorTipos, setErrorTipos] = useState<string | null>(null);


  // ---- modales
  const [isModalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Movimiento | null>(null);

  // ---- depósitos reales
  const [depositos, setDepositos] = useState<DepositoDTO[]>([]);
  const [loadingDep, setLoadingDep] = useState(false);
  const [errorDep, setErrorDep] = useState<string | null>(null);

  // ---- stock (para saber productos por depósito)
  const [stock, setStock] = useState<StockRowDTO[]>([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);

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
    return () => {
      mounted = false;
    };
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

  // Cargar stock (de todos los depósitos; filtramos en cliente)
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
    return () => {
      mounted = false;
    };
  }, []);

  const stockIndex = useMemo<StockIndex>(() => {
    const idx: StockIndex = {};
    for (const r of stock) {
      if (!idx[r.depositId]) idx[r.depositId] = {};
      idx[r.depositId][r.productId] = r.stockActual;
    }
    return idx;
  }, [stock]);


  // Mapa: depósitoId -> ProductoLite[]
  const productosPorDeposito: Record<number, ProductoLite[]> = useMemo(() => {
    const map: Record<number, ProductoLite[]> = {};
    for (const row of stock) {
      if (!map[row.depositId]) map[row.depositId] = [];
      const ya = map[row.depositId].some((p) => p.id === row.productId);
      if (!ya) {
        map[row.depositId].push({
          id: row.productId,
          codigo: String(row.productId), // si tenés 'codigo' real, reemplazalo
          descripcion: row.productDescripcion,
        });
      }
    }
    return map;
  }, [stock]);

  // depósito que sugerimos como inicial en el modal
  const modalDepositoId = depositos.length ? depositos[0].id : 0;

  // Helper: productos para un depósito
  const productosForDeposito = (depId: number): ProductoLite[] => {
    if (!depId) return [];
    return productosPorDeposito[depId] ?? [];
  };

  // ---- filtros de UI (por ahora sólo afectan a la tabla mock)
  const [filters, setFilters] = useState<FiltersState>({
    fechaDesde: "",
    fechaHasta: "",
    movimiento: "",
    depositoId: "",
    tipoMovimiento: "",
    q: "",
  });

  const clearFilters = () =>
    setFilters({
      fechaDesde: "",
      fechaHasta: "",
      movimiento: "",
      depositoId: "",
      tipoMovimiento: "",
      q: "",
    });

  // Filtrado mock
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

  // ---- handlers
  const onSearch = () => {};
  const handleCreate = () => setModalOpen(true);

  const onSubmitModal = async (p: MovimientoPayload) => {
    // TODO: reemplazar por POST real a /api/movimientos
    // Por ahora seguimos agregando a mock para que veas el flujo:
    const nextId = (movimientos[movimientos.length - 1]?.id ?? 0) + 1;

    const depById = (id?: number) =>
      id ? depositos.find((d) => d.id === id) : undefined;

    const productos = p.productos.map((it) => {
      // Intentamos “enriquecer” con lo que ya tenemos en productosPorDeposito
      const plist = it && p.depositoId ? productosPorDeposito[p.depositoId] ?? [] : [];
      const prod = plist.find((x) => x.id === it.productoId) || {
        id: it.productoId,
        codigo: String(it.productoId),
        descripcion: "Producto",
      };
      return { producto: prod, cantidad: it.cantidad };
    });

    const nuevo: Movimiento = {
      id: nextId,
      fechaISO: new Date().toISOString().slice(0, 10),
      movimiento: p.movimiento,
      tipoMovimiento: p.tipoMovimiento,
      comprobanteId: p.comprobanteId,
      comentario: p.comentario,
      productos,
      deposito: depById(p.depositoId),
    };

    setMovimientos((prev) => [...prev, nuevo]);
    setModalOpen(false);
  };

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* Breadcrumb / Header */}
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

      {/* Stats de la tabla mock */}
      <StatsCards total={stats.total} ingresos={stats.ingresos} egresos={stats.egresos} />

      {/* Filtros (pueden usar depositos reales) */}
      <MovimientosFilters
        state={filters}
        onChange={(patch) => setFilters((s) => ({ ...s, ...patch }))}
        depositos={depositos.map((d) => ({ id: d.id, nombre: d.nombre }))}
        onSearch={onSearch}
        onClear={clearFilters}
      />

      {/* Tabla (mock por ahora) */}
      <MovimientosTable
        data={filtered}
        onViewDetail={(m) => {
          setSelected(m);
          setDetailOpen(true);
        }}
        onNew={handleCreate}
      />

      {/* Modal: ahora recibe depósitos reales y el MAPA de productos por depósito */}
      <MovimientosModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        depositos={depositos.map((d) => ({ id: d.id, nombre: d.nombre }))}        
        productosPorDeposito={productosPorDeposito}
        productos={productosForDeposito(modalDepositoId)}  //revisar esto
        onSubmit={onSubmitModal}
        initial={{ depositoId: modalDepositoId }}
        stockIndex={stockIndex}
        tiposMovimiento={tiposMov} 
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
