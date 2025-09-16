// src/components/movimientos/MovimientosTable.tsx
'use client';

import { FC } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Movimiento } from '@/lib/movimientos/productsData';
import { Eye } from 'lucide-react'

type Props = {
  data: Movimiento[];
  onViewDetail?: (mov: Movimiento) => void;
  onNew?: () => void;
};

const Th: FC<React.ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({
  className,
  children,
  ...rest
}) => (
  <th
    className={`px-6 py-4 text-left text-sm font-bold text-dark-blue ${className ?? ''}`}
    {...rest}
  >
    {children}
  </th>
);

const Td: FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...rest
}) => (
  <td
    className={`px-6 py-4 text-sm text-gray-700 ${className ?? ''}`}
    {...rest}
  >
    {children}
  </td>
);

const MovimientosTable: FC<Props> = ({ data, onViewDetail, onNew }) => {
  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover">
      {/* Header / CTA */}
      <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Historial de Movimientos</h3>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <Th>ID</Th>
              <Th>Registro</Th>
              <Th>Depósito</Th>
              <Th>Movimiento</Th>
              <Th>Tipo de Movimiento</Th>
              <Th>ID Comprobante</Th>
              <Th>Comentario</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => {
              const depositoLabel =
                m.tipoMovimiento === 'Transferencia entre depósitos'
                  ? `${m.depositoOrigen?.nombre ?? '-'} → ${m.depositoDestino?.nombre ?? '-'}`
                  : m.deposito?.nombre ?? '-';

              const badgeClass =
                m.movimiento === 'Ingreso'
                  ? 'status-active text-white'
                  : 'status-inactive text-white';

              return (
                <tr key={m.id} className="product-row hover:bg-gray-50/60 transition-colors">
                  <Td className="font-semibold">{m.id}</Td>
                  <Td>{m.fechaISO}</Td>
                  <Td>{depositoLabel}</Td>
                  <Td>
                    <Badge className={`px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
                      {m.movimiento}
                    </Badge>
                  </Td>
                  <Td>{m.tipoMovimiento}</Td>
                  <Td className="font-mono">{m.comprobanteId ?? '-'}</Td>
                  <Td className="max-w-[320px] truncate" title={m.comentario ?? ''}>
                    {m.comentario ?? '-'}
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onViewDetail?.(m)}>
                        <Eye className="w-4 h-4" aria-hidden />
                      </Button>
                    </div>
                  </Td>
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-500">No hay movimientos para los filtros seleccionados.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovimientosTable;
