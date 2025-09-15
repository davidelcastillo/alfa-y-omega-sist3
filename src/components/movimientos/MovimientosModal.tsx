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

// TEMP: mock de stock disponible hasta conectar DB.
// Reemplazá por una consulta real (p. ej. fetch a tu API).
function getStockDisponible(productoId: number, depositoId: number): number {
  if (!productoId || !depositoId) return 0;
  // TODO: reemplazar por el valor real
  return 120; 
}

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
  const [numero, setNumero] = useState('');


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
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
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
            {/* Número (opcional) + Tipo de movimiento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reemplaza "Movimiento" por este input */}
              <Input
                label="Número"
                placeholder="N° remito / N°  de factura"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="input-focus"
              />

              <div className="md:col-span-2">
                {/* Tipo de movimiento como menú desplegable (Select nativo) */}
                <Select
                  label="Tipo de Movimiento *"
                  value={tipoMovimiento}
                  onChange={(e) => setTipoMovimiento(e.target.value as TipoMovimiento)}
                  className="input-focus"
                >
                  {TM_OPTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

              <SearchableSelect
                label="Depósito *"
                options={depOptions}
                valueId={deposito}
                onChange={(opt) => setDeposito(opt?.id ?? 0)}
                placeholder="Seleccionar depósito"
              />

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
                {items.map((row, idx) => {
                  // Depósito efectivo para el cálculo de stock:
                  // - Transferencia: usamos el depósito DESTINO (ingreso en destino)
                  // - Resto: el depósito elegido
                  const depositoEfectivo = isTransfer ? depositoDestino : deposito;

                  const stockActual =
                    row.productoId && depositoEfectivo
                      ? getStockDisponible(row.productoId, depositoEfectivo)
                      : 0;

                  // Por ahora asumimos TODO ingreso => resultante = actual + cantidad
                  const resultante = stockActual + (Number(row.cantidad) || 0);

                  return (
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

                        {/* Indicadores de stock */}
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                            <div className="text-gray-500 font-medium">Stock actual</div>
                            <div className="font-semibold text-dark-blue">{stockActual}</div>
                          </div>
                          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                            <div className="text-emerald-700 font-medium">Stock resultante</div>
                            <div className="font-semibold text-emerald-700">{resultante}</div>
                          </div>
                        </div>
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
                  );
                })}
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
