// src/components/ventas/VentasModal.tsx
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

// ---- Tipos locales ----
export type MovimientoBasico = 'Ingreso' | 'Egreso';
export type TipoMovimiento =
  | 'Compra de inventario'
  | 'Venta de inventario'
  | 'Ajuste de stock'
  | string;

export type Deposito = { id: number; nombre: string };
export type ProductoLite = { id: number; descripcion: string; codigo?: string };

type ProductRow = { productoId: number; cantidad: number };
type StockIndex = Record<number, Record<number, number>>;

type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };

export type MovimientoPayload = {
  movimiento: MovimientoBasico;
  tipoMovimiento: TipoMovimiento;
  depositoId?: number;
  tipoMovimientoId?: number;
  numeroComprobante?: string;
  comentario?: string;
  productos: Array<{ productoId: number; cantidad: number }>;
  pedidoId?: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  depositos: Deposito[];
  productosPorDeposito: Record<number, ProductoLite[]>;
  stockIndex: StockIndex;
  tiposMovimiento: TipoMovimientoDTO[];
  onSubmit: (payload: MovimientoPayload) => void;
  pedidoId: string | null;
};

// ---- Helpers ----
function getStockDisponible(
  productoId: number,
  depositoId: number,
  stockIndex: StockIndex
): number {
  if (!productoId || !depositoId) return 0;
  return stockIndex[depositoId]?.[productoId] ?? 0;
}

export default function VentasModal({
  isOpen,
  onClose,
  depositos,
  productosPorDeposito,
  onSubmit,
  pedidoId: pedidoIdProp,
  stockIndex,
  tiposMovimiento,
}: Props) {
  // ---- Estados ----
  const [movimiento, setMovimiento] = useState<MovimientoBasico>('Egreso');
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('Egreso por Venta (Egreso)');
  const [tipoMovimientoId, setTipoMovimientoId] = useState<number>(6); // 6: Egreso por Venta
  const [numero, setNumero] = useState('');
  const [deposito, setDeposito] = useState<number>(2); // 2: Deposito Norte (default)
  const [comentario, setComentario] = useState('');
  const [items, setItems] = useState<ProductRow[]>([]);
  const [isBuscando, setIsBuscando] = useState(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null); // DB id of the order
  const [direccionEnvio, setDireccionEnvio] = useState('');

  // ---- Opciones para selects ----
  const depOptions = useMemo(
    () => depositos.map((d) => ({ id: d.id, nombre: d.nombre })),
    [depositos]
  );

  const productosDisponibles: ProductoLite[] = useMemo(() => {
    // For this modal, products can be from any warehouse since they are pre-filled
    return Object.values(productosPorDeposito).flat();
  }, [productosPorDeposito]);

  const prodOptions = useMemo(
    () =>
      productosDisponibles.map((p) => ({
        id: p.id,
        nombre: `${p.descripcion}${p.codigo ? ` (${p.codigo})` : ''}`,
      })),
    [productosDisponibles]
  );

  // ---- Helpers de formulario ----
  const canSubmit = () => {
    const hasProducts =
      items.length > 0 &&
      items.every((it) => Number(it.productoId) > 0 && Number(it.cantidad) > 0);
    if (!hasProducts || isBuscando) return false;
    return deposito > 0 && tipoMovimientoId > 0;
  };

  const handleBuscarPedido = async (numeroComprobante: string) => {
    if (!numeroComprobante) return;
    setIsBuscando(true);
    setItems([]);
    setDireccionEnvio('');
    setPedidoId(null);
    setComentario('');
    try {
      const response = await fetch(`/api/pedidos/${numeroComprobante.trim()}`);
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }
      const pedido = await response.json();

      if (pedido && pedido.items && pedido.items.length > 0) {
        setPedidoId(pedido.id);
        setNumero(numeroComprobante.trim());
        setDireccionEnvio(pedido.DireccionEnvioId ?? 'No especificada');
        setComentario(`Movimiento de stock automático por venta del Pedido N° ${numeroComprobante.trim()}`);

        const nuevosItems = pedido.items.map((item: any) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
        }));
        setItems(nuevosItems);
      } else {
        console.log('Pedido no encontrado o sin items.');
      }
    } catch (error) {
      console.error('Error al buscar el pedido:', error);
    } finally {
      setIsBuscando(false);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    const tipoSeleccionado = tiposMovimiento.find((t) => t.id === tipoMovimientoId);
    const esIngreso = tipoSeleccionado?.saldo ?? true;

    const payload: MovimientoPayload = {
      movimiento: esIngreso ? 'Ingreso' : 'Egreso',
      tipoMovimiento,
      depositoId: Number(deposito),
      tipoMovimientoId: Number(tipoMovimientoId),
      numeroComprobante: numero || undefined,
      comentario: comentario || undefined,
      productos: items.map((it) => ({
        productoId: Number(it.productoId),
        cantidad: esIngreso ? Math.abs(Number(it.cantidad) || 0) : -Math.abs(Number(it.cantidad) || 0),
      })),
      pedidoId: pedidoId ?? undefined,
    };

    onSubmit(payload);
    onClose();
  };

  // ---- Efectos ----
  useEffect(() => {
    if (isOpen && pedidoIdProp) {
      handleBuscarPedido(pedidoIdProp);
    } else if (!isOpen) {
      setItems([]);
      setDireccionEnvio('');
      setPedidoId(null);
      setComentario('');
      setNumero('');
    }
  }, [isOpen, pedidoIdProp]);


  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!tipoMovimientoId) return;
    const tm = tiposMovimiento.find((t) => t.id === tipoMovimientoId);
    if (tm) {
      setTipoMovimiento(tm.nombre as TipoMovimiento);
      setMovimiento(tm.saldo ? 'Ingreso' : 'Egreso');
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
              Registrar Movimiento de Stock por Venta
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
          {isBuscando && <p className="text-center">Buscando datos del pedido...</p>}

          {!isBuscando && items.length === 0 && pedidoIdProp && (
            <p className="text-center text-red-500">
              No se encontraron los datos del pedido.
            </p>
          )}

          {/* Número + Tipo de movimiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Número de comprobante"
                value={numero}
                readOnly
                className="input-focus bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <Select
                label="Tipo de Movimiento *"
                value={String(tipoMovimientoId || 0)}
                readOnly
                className="input-focus bg-gray-100"
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

          {/* Depósito único */}
          <Select
            label="Depósito *"
            value={String(deposito || 0)}
            readOnly
            className="input-focus bg-gray-100"
          >
            <option value="0" disabled>Seleccionar depósito</option>
            {depOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </Select>

          {/* Dirección de envío */}
          <Input
            label="Dirección de Envío"
            value={direccionEnvio}
            readOnly
            className="input-focus bg-gray-100"
          />

          {/* Comentario */}
          <Input
            label="Comentario"
            value={comentario}
            readOnly
            className="input-focus bg-gray-100"
            placeholder="Notas del movimiento..."
          />

          {/* Productos */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Productos *</h4>
            <div className="space-y-3">
              {items.map((row, idx) => {
                const stockActual =
                  row.productoId && deposito
                    ? getStockDisponible(row.productoId, deposito, stockIndex)
                    : 0;

                const tm = tiposMovimiento.find((t) => t.id === tipoMovimientoId);
                const esIngreso = tm?.saldo ?? true;
                const cantidadNum = Number(row.cantidad) || 0;

                const signedQty = esIngreso
                  ? +Math.abs(cantidadNum)
                  : -Math.abs(cantidadNum);

                const resultante = stockActual + signedQty;
                const stockInsuficiente = resultante < 0;

                return (
                  <div key={idx} className="product-row p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-8">
                       <SearchableSelect
                        label="Producto"
                        options={prodOptions}
                        valueId={row.productoId}
                        onChange={() => {}} // No editable
                        placeholder="Producto del pedido"
                        readOnly={true}
                      />
                    </div>

                    <div className="md:col-span-3">
                       <Input
                        label="Cantidad"
                        type="number"
                        value={row.cantidad}
                        readOnly
                        className="input-focus bg-gray-100"
                      />

                      {/* Indicadores de stock */}
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                          <div className="text-gray-500 font-medium">Stock actual</div>
                          <div className="font-semibold text-dark-blue">{stockActual}</div>
                        </div>
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            stockInsuficiente
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          <div
                            className={`font-medium ${
                              stockInsuficiente ? 'text-red-700' : 'text-emerald-700'
                            }`}
                          >
                            Stock resultante
                          </div>
                          <div
                            className={`font-semibold ${
                              stockInsuficiente ? 'text-red-700' : 'text-emerald-700'
                            }`}
                          >
                            {resultante}
                          </div>
                        </div>
                      </div>

                      {stockInsuficiente && (
                        <div className="mt-1 text-xs text-red-600">⚠️ Stock insuficiente</div>
                      )}
                    </div>

                    <div className="md:col-span-1 flex items-end justify-end">
                      {/* Remove button is disabled */}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              {/* Add product button is disabled */}
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
