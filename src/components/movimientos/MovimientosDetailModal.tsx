// src/components/movimientos/MovimientosDetailModal.tsx
'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/** Tipos locales (sin mocks, sin transferencias) */
export type MovimientoBasico = 'Ingreso' | 'Egreso';

export type Movimiento = {
  id: number;
  fechaISO: string;               // yyyy-mm-dd
  hora?: string;                  // hh:mm (opcional)
  movimiento: MovimientoBasico;   // Ingreso | Egreso
  tipoMovimiento: string;         // nombre normalizado que muestra la UI
  comprobanteId?: string;
  comentario?: string;
  deposito?: { id: number; nombre: string } | null;
  productos: Array<{
    producto: { id: number; descripcion: string; codigo?: string };
    cantidad: number; // negativo si es egreso (si así lo manejás)
  }>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  movimiento?: Movimiento | null;
};

function toHHMM(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (!Number.isNaN(d.getTime())) {
    return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  }
  const m = String(input).match(/^(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : '';
}

export default function MovimientosDetailModal({ isOpen, onClose, movimiento }: Props) {
  // Cerrar con ESC (además del cierre propio del AlertDialog)
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!movimiento) return null;

  const depositoLabel = movimiento.deposito?.nombre ?? '-';
  const isIngreso = movimiento.movimiento === 'Ingreso';
  const badgeClass = isIngreso ? 'status-active text-white' : 'status-inactive text-white';

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent
        className="glass-effect p-0 overflow-hidden w-full max-w-3xl md:max-w-5xl h-[85vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Detalle del Movimiento
            </AlertDialogTitle>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-auto overflow-y-auto p-8 space-y-8">
          {/* Info principal */}
          <div className="grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-effect rounded-xl p-6">
              <h4 className="text-lg font-semibold text-dark-blue mb-4">
                Información del Movimiento
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-600 font-medium">Movimiento:</span>
                  <Badge className={`px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
                    {movimiento.movimiento}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Tipo:</span>
                  <span className="font-semibold text-gray-900">
                    {movimiento.tipoMovimiento}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Depósito:</span>
                  <span className="font-semibold text-gray-900">{depositoLabel}</span>
                </div>
                {/* Pondria hora pero en la base manda lo mismo que fecha */}
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Fecha:</span>
                  <span className="font-semibold text-gray-900">
                    {movimiento.fechaISO}{movimiento.hora ? ` ${movimiento.hora}` : ''}  
                  </span>
                </div>

                {movimiento.comprobanteId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">N° Comprobante:</span>
                    <span className="font-semibold text-gray-900">
                      {movimiento.comprobanteId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comentario */}
          <div className="glass-effect rounded-xl p-6">
            <h4 className="text-lg font-semibold text-dark-blue mb-4">Comentario</h4>
            <p className="text-gray-700">{movimiento.comentario ?? 'Sin comentarios'}</p>
          </div>

          {/* Productos */}
          <div className="glass-effect rounded-xl p-6">
            <h4 className="text-lg font-semibold text-dark-blue mb-6">Productos Relacionados</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-dark-blue">
                      Producto
                    </th>
                    {/* <th className="px-4 py-3 text-left text-sm font-bold text-dark-blue">Código</th> */}
                    <th className="px-4 py-3 text-center text-sm font-bold text-dark-blue">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {movimiento.productos.map((p, i) => (
                    <tr key={i} className="product-row">
                      <td className="px-4 py-3 text-sm">{p.producto.descripcion}</td>
                      {/* <td className="px-4 py-3 text-sm font-mono">{p.producto.codigo}</td> */}
                      <td className="px-4 py-3 text-sm text-center">{p.cantidad}</td>
                    </tr>
                  ))}
                  {movimiento.productos.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        Sin productos registrados en este movimiento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
