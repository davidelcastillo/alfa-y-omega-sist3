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
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type {
  Deposito,
  ProductoLite,
  MovimientoBasico,
  TipoMovimiento,
} from '@/lib/movimientos/productsData';

type ProductRow = { productoId: number; cantidad: number };
type StockIndex = Record<number, Record<number, number>>;

// Tipos de movimiento que vienen de la API
type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };

export type MovimientoPayload = {
  movimiento: MovimientoBasico;
  tipoMovimiento: TipoMovimiento;
  depositoId?: number;
  tipoMovimientoId?: number;
  numeroComprobante?: string;
  depositoOrigenId?: number;
  depositoDestinoId?: number;
  comprobanteId?: string;
  comentario?: string;
  productos: Array<{ productoId: number; cantidad: number }>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  depositos: Deposito[];
  productosPorDeposito: Record<number, ProductoLite[]>;
  stockIndex: StockIndex;
  tiposMovimiento: TipoMovimientoDTO[];
  onSubmit: (payload: MovimientoPayload) => void;
  initial?: Partial<MovimientoPayload>;
};

function getStockDisponible(
  productoId: number,
  depositoId: number,
  stockIndex: StockIndex
): number {
  if (!productoId || !depositoId) return 0;
  return stockIndex[depositoId]?.[productoId] ?? 0;
}

export default function MovimientosModal({
  isOpen,
  onClose,
  depositos,
  productosPorDeposito,
  onSubmit,
  initial,
  stockIndex,
  tiposMovimiento,
}: Props) {
  // ---- Estados ----
  const [movimiento, setMovimiento] = useState<MovimientoBasico>('Ingreso');
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>(
    tiposMovimiento.find(tm => tm.saldo)?.nombre as TipoMovimiento ?? 'Ingreso por Compra'
  );
  const [tipoMovimientoId, setTipoMovimientoId] = useState<number>(0);
  const [numero, setNumero] = useState('');
  const [deposito, setDeposito] = useState<number>(0);
  const [depositoOrigen, setDepositoOrigen] = useState<number>(0);
  const [depositoDestino, setDepositoDestino] = useState<number>(0);
  const [comprobanteId, setComprobanteId] = useState('');
  const [comentario, setComentario] = useState('');
  const [items, setItems] = useState<ProductRow[]>([{ productoId: 0, cantidad: 1 }]);

  // ---- Opciones para selects ----
  const depOptions = useMemo(
    () => depositos.map((d) => ({ id: d.id, nombre: d.nombre })),
    [depositos]
  );

  const productosDisponibles: ProductoLite[] = useMemo(() => {
    const depId = Number(deposito);
    return depId ? (productosPorDeposito[depId] ?? []) : [];
  }, [productosPorDeposito, deposito]);

  const prodOptions = useMemo(
    () =>
      productosDisponibles.map((p) => ({
        id: p.id,
        nombre: `${p.descripcion}${p.codigo ? ` (${p.codigo})` : ''}`,
      })),
    [productosDisponibles]
  );
  
  // Usar la propiedad 'nombre' para la lógica condicional
  const isTransfer = tipoMovimiento === 'Egreso por Traspaso' || tipoMovimiento === 'Ingreso por Traspaso';
  
  // ---- Helpers ----
  const resetForm = () => {
    setMovimiento(initial?.movimiento ?? 'Ingreso');
    setTipoMovimiento(initial?.tipoMovimiento ?? (tiposMovimiento.find(tm => tm.saldo)?.nombre as TipoMovimiento ?? 'Ingreso por Compra'));
    setTipoMovimientoId(initial?.tipoMovimientoId ?? 0);
    setNumero('');
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
  };

  const canSubmit = () => {
    const hasProducts =
      items.length > 0 &&
      items.every((it) => Number(it.productoId) > 0 && Number(it.cantidad) > 0);
    if (!hasProducts) return false;

    if (isTransfer) {
      return depositoOrigen > 0 && depositoDestino > 0 && depositoOrigen !== depositoDestino;
    }
    return deposito > 0 && tipoMovimientoId > 0;
  };

  const patchRow = (idx: number, patch: Partial<ProductRow>) => {
    setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addRow = () => setItems((prev) => [...prev, { productoId: 0, cantidad: 1 }]);
  const removeRow = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!canSubmit()) return;

    // Obtener el tipo de movimiento seleccionado para determinar si es ingreso/egreso
    const tipoSeleccionado = tiposMovimiento.find(t => t.id === tipoMovimientoId);
    const esIngreso = tipoSeleccionado?.saldo ?? true;

    const payload: MovimientoPayload = {
      movimiento: esIngreso ? 'Ingreso' : 'Egreso',
      tipoMovimiento: tipoSeleccionado?.nombre as TipoMovimiento,
      depositoId: isTransfer ? undefined : Number(deposito),
      tipoMovimientoId: Number(tipoMovimientoId),
      numeroComprobante: numero || undefined,
      depositoOrigenId: isTransfer ? Number(depositoOrigen) : undefined,
      depositoDestinoId: isTransfer ? Number(depositoDestino) : undefined,
      comprobanteId: comprobanteId || undefined,
      comentario: comentario || undefined,
      productos: items.map((it) => ({
        productoId: Number(it.productoId),
        cantidad: esIngreso ? Math.abs(Number(it.cantidad)) : -Math.abs(Number(it.cantidad)),
      })),
    };

    onSubmit(payload);
    onClose();
  };

  // ---- Efectos ----
  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  // Sincronizar el nombre del tipo cuando cambia el ID seleccionado
  useEffect(() => {
    if (!tipoMovimientoId) return;
    const tm = tiposMovimiento.find((t) => t.id === tipoMovimientoId);
    if (tm) {
      setTipoMovimiento(tm.nombre as TipoMovimiento);
      setMovimiento(tm.saldo ? 'Ingreso' : 'Egreso');
      // Si el movimiento seleccionado es una transferencia, limpiar los campos de depósito
      if (isTransfer) {
        setDeposito(0);
      } else {
        setDepositoOrigen(0);
        setDepositoDestino(0);
      }
    }
  }, [tipoMovimientoId, tiposMovimiento]);

  // ---- Render ----
  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <AlertDialogContent
        className="
          glass-effect
          p-0 overflow-hidden  
          w-full max-w-3xl md:max-w-5xl
          h-[85vh]
        "
      >
        {/* Header */}
        <div className="flex-none p-6 rounded-t-2xl bg-gradient-to-r from-primary-pink to-light-pink">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Registrar Movimiento de Stock
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
          {/* Número + Tipo de movimiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Número de remito"
              placeholder="Ingrese N° de remito"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="input-focus"
            />

            <div className="md:col-span-2">
              <Select
                label="Tipo de Movimiento *"
                value={String(tipoMovimientoId || 0)}
                onChange={(e) => setTipoMovimientoId(Number(e.target.value) || 0)}
                className="input-focus"
              >
                <option value="0" disabled>Seleccionar tipo</option>
                {tiposMovimiento.map((tm) => (
                  <option key={tm.id} value={tm.id}>
                    {tm.nombre} ({tm.saldo ? 'Ingreso' : 'Egreso'})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Mostrar tipo de movimiento seleccionado */}
          {tipoMovimientoId > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  movimiento === 'Ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {movimiento}
                </div>
                <span className="text-gray-700">{tipoMovimiento}</span>
              </div>
            </div>
          )}

          {/* Depósitos */}
          {!isTransfer ? (
            <Select
              label="Depósito *"
              value={String(deposito || 0)}
              onChange={(e) => setDeposito(Number(e.target.value) || 0)}
              className="input-focus"
            >
              <option value="0" disabled>Seleccionar depósito</option>
              {depOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </Select>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Depósito Origen *"
                value={String(depositoOrigen || 0)}
                onChange={(e) => setDepositoOrigen(Number(e.target.value) || 0)}
                className="input-focus"
              >
                <option value="0" disabled>Seleccionar origen</option>
                {depOptions.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.id === depositoDestino}>
                    {d.nombre}
                  </option>
                ))}
              </Select>

              <Select
                label="Depósito Destino *"
                value={String(depositoDestino || 0)}
                onChange={(e) => setDepositoDestino(Number(e.target.value) || 0)}
                className="input-focus"
              >
                <option value="0" disabled>Seleccionar destino</option>
                {depOptions.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.id === depositoOrigen}>
                    {d.nombre}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Comentario */}
          <Input
            label="Comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="input-focus"
            placeholder="Notas del movimiento..."
          />
          
          {/* Productos */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Productos *</h4>
            <div className="space-y-3">
              {items.map((row, idx) => {
                const depositoEfectivo = isTransfer ? depositoDestino : deposito;
                const stockActual = row.productoId && depositoEfectivo
                  ? getStockDisponible(row.productoId, depositoEfectivo, stockIndex)
                  : 0;

                // Calcular stock resultante
                const tm = tiposMovimiento.find(t => t.id === tipoMovimientoId);
                const esIngreso = tm?.saldo ?? true;
                const cantidadNum = Number(row.cantidad) || 0;

                const signedQty = esIngreso ? +Math.abs(cantidadNum) : -Math.abs(cantidadNum);

                const resultante = stockActual + signedQty;
                const stockInsuficiente = resultante < 0;

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
                        <div className={`rounded-lg px-3 py-2 ${
                          stockInsuficiente 
                            ? 'bg-red-50 border border-red-200' 
                            : 'bg-emerald-50 border border-emerald-200'
                        }`}>
                          <div className={`font-medium ${
                            stockInsuficiente ? 'text-red-700' : 'text-emerald-700'
                          }`}>
                            Stock resultante
                          </div>
                          <div className={`font-semibold ${
                            stockInsuficiente ? 'text-red-700' : 'text-emerald-700'
                          }`}>
                            {resultante}
                          </div>
                        </div>
                      </div>

                      {stockInsuficiente && (
                        <div className="mt-1 text-xs text-red-600">
                          ⚠️ Stock insuficiente
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-1 flex items-end justify-end">
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="remove-product-btn w-10 h-10 rounded-lg bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white"
                        title="Quitar"
                        aria-label="Quitar producto"
                        disabled={items.length === 1}
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