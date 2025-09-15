// src/components/movimientos/MovimientosModal.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchableSelect from '@/components/ui/SearchableSelect';
import {
  AlertDialog,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';

import type {
  Deposito,
  ProductoLite,
  MovimientoBasico,
  TipoMovimiento,
} from '@/lib/movimientos/productsData';

type ProductRow = { productoId: number; cantidad: number };

export type MovimientoPayload = {
  movimiento: MovimientoBasico; // Ingreso | Egreso
  tipoMovimiento: TipoMovimiento;
  // depósito único para compra/venta/ajuste/ingreso
  depositoId?: number;
  // depósitos para transferencia
  depositoOrigenId?: number;
  depositoDestinoId?: number;
  comprobanteId?: string;
  comentario?: string;
  productos: Array<{ productoId: number; cantidad: number }>;
  // extra opcional para “ajuste”
  ajusteSigno?: 'positivo' | 'negativo';
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  depositos: Deposito[];
  productos: ProductoLite[];
  onSubmit: (payload: MovimientoPayload) => void;
  /** Opcional: valores iniciales (para edición en el futuro) */
  initial?: Partial<MovimientoPayload>;
};

const TM_OPTS: TipoMovimiento[] = [
  'Transferencia entre depósitos',
  'Compra de inventario',
  'Venta de inventario',
  'Ajuste de stock',
];

export default function MovimientosModal({
  isOpen,
  onClose,
  depositos,
  productos,
  onSubmit,
  initial,
}: Props) {
  // ---- state base
  const [movimiento, setMovimiento] = useState<MovimientoBasico>('Ingreso');
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('Compra de inventario');

  // depósitos (0 = ninguno)
  const [deposito, setDeposito] = useState<number>(0);
  const [depositoOrigen, setDepositoOrigen] = useState<number>(0);
  const [depositoDestino, setDepositoDestino] = useState<number>(0);

  // comprobante/comentario
  const [comprobanteId, setComprobanteId] = useState('');
  const [comentario, setComentario] = useState('');

  // productos
  const [items, setItems] = useState<ProductRow[]>([{ productoId: 0, cantidad: 1 }]);

  // ajuste
  const [ajusteSigno, setAjusteSigno] = useState<'positivo' | 'negativo'>('positivo');

  // ---- options para SearchableSelect (espera {id, nombre})
  const depOptions = useMemo(
    () => depositos.map((d) => ({ id: d.id, nombre: d.nombre })),
    [depositos]
  );
  const prodOptions = useMemo(
    () => productos.map((p) => ({ id: p.id, nombre: `${p.descripcion} (${p.codigo})` })),
    [productos]
  );
  const tipoMovOptions = useMemo(
    () => TM_OPTS.map((t, i) => ({ id: i + 1, nombre: t })), // id sintético
    []
  );

  const isTransfer = tipoMovimiento === 'Transferencia entre depósitos';
  const isAjuste = tipoMovimiento === 'Ajuste de stock';

  // ---- helpers
  const resetForm = () => {
    setMovimiento(initial?.movimiento ?? 'Ingreso');
    setTipoMovimiento(initial?.tipoMovimiento ?? 'Compra de inventario');

    setDeposito(initial?.depositoId ?? 0);
    setDepositoOrigen(initial?.depositoOrigenId ?? 0);
    setDepositoDestino(initial?.depositoDestinoId ?? 0);

    setComprobanteId(initial?.comprobanteId ?? '');
    setComentario(initial?.comentario ?? '');

    setItems(
      initial?.productos?.length
        ? initial.productos.map((p) => ({
            productoId: p.productoId,
            cantidad: p.cantidad,
          }))
        : [{ productoId: 0, cantidad: 1 }]
    );

    setAjusteSigno(initial?.ajusteSigno ?? 'positivo');
  };

  const canSubmit = () => {
    const hasProducts =
      items.length > 0 &&
      items.every((it) => Number(it.productoId) > 0 && Number(it.cantidad) > 0);
    if (!hasProducts) return false;

    if (isTransfer) {
      return depositoOrigen > 0 && depositoDestino > 0 && depositoOrigen !== depositoDestino;
    }
    // compra/venta/ajuste/ingreso → un solo depósito
    return deposito > 0;
  };

  const patchRow = (idx: number, patch: Partial<ProductRow>) => {
    setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addRow = () => setItems((prev) => [...prev, { productoId: 0, cantidad: 1 }]);
  const removeRow = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!canSubmit()) return;

    const payload: MovimientoPayload = {
      movimiento,
      tipoMovimiento,
      depositoId: isTransfer ? undefined : Number(deposito),
      depositoOrigenId: isTransfer ? Number(depositoOrigen) : undefined,
      depositoDestinoId: isTransfer ? Number(depositoDestino) : undefined,
      comprobanteId: comprobanteId || undefined,
      comentario: comentario || undefined,
      productos: items.map((it) => ({
        productoId: Number(it.productoId),
        cantidad:
          isAjuste && ajusteSigno === 'negativo'
            ? -Math.abs(Number(it.cantidad))
            : Number(it.cantidad),
      })),
      ajusteSigno: isAjuste ? ajusteSigno : undefined,
    };

    onSubmit(payload);
    onClose();
  };

  // ---- efectos
  useEffect(() => {
    if (isOpen) resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // cierre con ESC además del propio AlertDialog
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  // ---- render
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent className="
      glass-effect
      p-0 overflow-hidden  
      w-full max-w-3xl md:max-w-5xl
      h-[85vh]                 /* ALTURA FIJA del modal */
">

        {/* Header */}
        <div className="flex-none bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <h3 id="modal-title-movimientos" className="text-2xl font-bold text-white">
              Registrar Movimiento de Stock
            </h3>
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
          {/* Selección de movimiento y tipo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Movimiento *"
              value={movimiento}
              onChange={(e) => setMovimiento(e.target.value as MovimientoBasico)}
              className="input-focus"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </Select>

            <div className="md:col-span-2">
              <SearchableSelect
                label="Tipo de Movimiento *"
                options={tipoMovOptions}
                valueId={tipoMovOptions.find(o => o.nombre === tipoMovimiento)?.id ?? 0}
                onChange={(opt) =>
                  setTipoMovimiento((opt?.nombre as TipoMovimiento) ?? 'Compra de inventario')
                }
                placeholder="Seleccionar tipo"
              />
            </div>
          </div>

          {/* Depósitos según tipo */}
          {isTransfer ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SearchableSelect
                label="Depósito Origen *"
                options={depOptions}
                valueId={depositoOrigen}
                onChange={(opt) => setDepositoOrigen(opt?.id ?? 0)}
                placeholder="Seleccionar depósito"
              />
              <SearchableSelect
                label="Depósito Destino *"
                options={depOptions}
                valueId={depositoDestino}
                onChange={(opt) => setDepositoDestino(opt?.id ?? 0)}
                placeholder="Seleccionar depósito"
              />
            </div>
          ) : (
            <SearchableSelect
              label="Depósito *"
              options={depOptions}
              valueId={deposito}
              onChange={(opt) => setDeposito(opt?.id ?? 0)}
              placeholder="Seleccionar depósito"
            />
          )}

          {/* Ajuste: signo */}
          {isAjuste && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Ajuste
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAjusteSigno('positivo')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    ajusteSigno === 'positivo'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Ajuste Positivo (incrementa stock)
                </button>
                <button
                  type="button"
                  onClick={() => setAjusteSigno('negativo')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    ajusteSigno === 'negativo'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Ajuste Negativo (reduce stock)
                </button>
              </div>
            </div>
          )}

          {/* Comprobante + Comentario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="ID Comprobante"
              value={comprobanteId}
              onChange={(e) => setComprobanteId(e.target.value)}
              className="input-focus"
              placeholder="Ej: F-000123"
            />
            <div className="md:col-span-2">
              <Input
                label="Comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="input-focus"
                placeholder="Notas del movimiento..."
              />
            </div>
          </div>

          {/* Productos */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Productos</h4>
            <div className="space-y-3">
              {items.map((row, idx) => (
                <div key={idx} className="product-row p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-8">
                    <SearchableSelect
                      label="Producto"
                      options={prodOptions}
                      valueId={row.productoId}
                      onChange={(opt) => patchRow(idx, { productoId: opt?.id ?? 0 })}
                      placeholder="Seleccionar producto"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Input
                      label="Cantidad"
                      type="number"
                      min={1}
                      value={row.cantidad}
                      onChange={(e) =>
                        patchRow(idx, {
                          cantidad: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="input-focus"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="remove-product-btn w-10 h-10 rounded-lg bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white"
                      title="Quitar"
                      aria-label="Quitar producto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={addRow}>
                Agregar producto
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="btn-primary"
              disabled={!canSubmit()}
              onClick={handleSubmit}
            >
              Registrar Movimiento
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
