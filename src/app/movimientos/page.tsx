// src/app/movimientos/page.tsx
'use client';

import { useMemo, useState } from 'react';
import StatsCards from '@/components/movimientos/StatsCards';
import MovimientosFilters, { type FiltersState } from '@/components/movimientos/MovimientosFilters';
import MovimientosTable from '@/components/movimientos/MovimientosTable';
import MovimientosModal, { type MovimientoPayload } from '@/components/movimientos/MovimientosModal';
import MovimientosDetailModal from '@/components/movimientos/MovimientosDetailModal';
import { Plus } from 'lucide-react'

import {
  depositosMock,
  productosLiteMock,
  movimientosMock,
  getStats,
  type Movimiento,
} from '@/lib/movimientos/productsData';

import Button from '@/components/ui/Button';

export default function MovimientosPage() {
  // ---- data base
  const [movimientos, setMovimientos] = useState<Movimiento[]>(movimientosMock);
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
  const onSearch = () => {};
  const handleCreate = () => setModalOpen(true);

  const onSubmitModal = (p: MovimientoPayload) => {
    const nextId = (movimientos[movimientos.length - 1]?.id ?? 0) + 1;
    const isTransfer = p.tipoMovimiento === 'Transferencia entre depósitos';
    const depById = (id?: number) => depositosMock.find((d) => d.id === id);
    const productos = p.productos.map((it) => {
      const prod = productosLiteMock.find((x) => x.id === it.productoId)!;
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
      ...(isTransfer
        ? { depositoOrigen: depById(p.depositoOrigenId), depositoDestino: depById(p.depositoDestinoId) }
        : { deposito: depById(p.depositoId) }),
    };

    setMovimientos((prev) => [...prev, nuevo]);
  };

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
