// src/components/movimientos/MovimientosFilters.tsx
'use client';

import { FC, useMemo } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Button from '@/components/ui/Button';
import DatePicker from '../ui/DatePicker';
import type { Deposito, TipoMovimiento } from '@/lib/movimientos/productsData';

export type FiltersState = {
  fechaDesde?: string;
  fechaHasta?: string;
  movimiento?: '' | 'Ingreso' | 'Egreso';
  depositoId?: number | '';
  tipoMovimiento?: '' | TipoMovimiento;
  q?: string; // búsqueda libre por comentario/comprobante
};

type Props = {
  state: FiltersState;
  onChange: (patch: Partial<FiltersState>) => void;
  depositos: Deposito[];
  onSearch?: () => void;
  onClear?: () => void;
};

const TM_OPTS: TipoMovimiento[] = [
  'Transferencia entre depósitos',
  'Compra de inventario',
  'Venta de inventario',
  'Ajuste de stock',
];

const MovimientosFilters: FC<Props> = ({ state, onChange, depositos, onSearch, onClear }) => {
  const depositoOpts = useMemo(
    () => depositos.map(d => ({ id: d.id, nombre: d.nombre })),
    [depositos]
  );

  const tipoMovOpts = useMemo(
    () => TM_OPTS.map((t, i) => ({ id: i + 1, nombre: t })), // id sintético
    []
  );

  const depositoValueId = state.depositoId && Number(state.depositoId) > 0 ? Number(state.depositoId) : 0;
  const tipoMovValueId = state.tipoMovimiento
    ? (tipoMovOpts.find(o => o.nombre === state.tipoMovimiento)?.id ?? 0)
    : 0;

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover">
      <h3 className="text-xl font-semibold text-dark-blue mb-6">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Fecha Desde (DatePicker shadcn) */}
        <DatePicker
          label="Fecha Desde"
          value={state.fechaDesde}
          onChange={(iso) => {
            // Si fechaHasta existe y es menor, la ajustamos
            const hasta = state.fechaHasta ?? '';
            if (hasta && iso > hasta) {
              onChange({ fechaDesde: iso, fechaHasta: iso });
            } else {
              onChange({ fechaDesde: iso });
            }
          }}
        />

        {/* Fecha Hasta (DatePicker shadcn) */}
        <DatePicker
          label="Fecha Hasta"
          value={state.fechaHasta}
          onChange={(iso) => {
            const desde = state.fechaDesde ?? '';
            if (desde && iso < desde) {
              onChange({ fechaDesde: iso, fechaHasta: iso });
            } else {
              onChange({ fechaHasta: iso });
            }
          }}
        />

        {/* Depósito */}
        <SearchableSelect
          label="Depósito"
          options={[{ id: 0, nombre: 'Todos los depósitos' }, ...depositoOpts]}
          valueId={depositoValueId}
          onChange={(opt) => onChange({ depositoId: opt && opt.id > 0 ? opt.id : '' })}
          placeholder="Seleccionar depósito"
        />

        {/* Tipo de Movimiento */}
        <SearchableSelect
          label="Tipo de Movimiento"
          options={[{ id: 0, nombre: 'Todos' }, ...tipoMovOpts]}
          valueId={tipoMovValueId}
          onChange={(opt) =>
            onChange({
              tipoMovimiento: !opt || opt.id === 0 ? '' : (opt.nombre as TipoMovimiento),
            })
          }
          placeholder="Seleccionar tipo"
        />

        {/* Búsqueda libre */}
        <Input
          label="Buscar"
          placeholder="Comentario o ID de comprobante…"
          value={state.q ?? ''}
          onChange={e => onChange({ q: e.target.value })}
          className="input-focus lg:col-span-1"
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={onClear}>Limpiar Filtros</Button>
        <Button variant="ghost" className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-blue to-dark-blue text-white hover:shadow-lg" onClick={onSearch}>Buscar Movimientos</Button>
      </div>
    </div>
  );
};

export default MovimientosFilters;
