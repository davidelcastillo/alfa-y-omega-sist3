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

// ---- Tipos locales (sin transferencias) ----
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
  comprobanteId?: string;
  comentario?: string;
  productos: Array<{ productoId: number; cantidad: number }>;
  ajusteSigno?: 'positivo' | 'negativo';
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
  initial?: Partial<MovimientoPayload>;
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
  const [movimiento, setMovimiento] = useState<MovimientoBasico>(
    (initial?.movimiento as MovimientoBasico) ?? 'Ingreso'
  );
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>(
    (initial?.tipoMovimiento as TipoMovimiento) ?? ''
  );
  const [tipoMovimientoId, setTipoMovimientoId] = useState<number>(initial?.tipoMovimientoId ?? 0);
  const [numero, setNumero] = useState(initial?.numeroComprobante ?? '');
  const [deposito, setDeposito] = useState<number>(initial?.depositoId ?? 0);
  const [comprobanteId, setComprobanteId] = useState(initial?.comprobanteId ?? '');
  const [comentario, setComentario] = useState(initial?.comentario ?? '');
  const [items, setItems] = useState<ProductRow[]>(
    initial?.productos?.length
      ? initial.productos.map((p) => ({ productoId: p.productoId, cantidad: p.cantidad }))
      : [{ productoId: 0, cantidad: 1 }]
  );
  const [ajusteSigno, setAjusteSigno] = useState<'positivo' | 'negativo'>(
    (initial?.ajusteSigno as 'positivo' | 'negativo') ?? 'positivo'
  );
  const [numeroComprobanteBusqueda, setNumeroComprobanteBusqueda] = useState('');
  const [isBuscando, setIsBuscando] = useState(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null);

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

  const isAjuste = tipoMovimiento === 'Ajuste de stock';

  // ---- Helpers de formulario ----
  const resetForm = () => {
    setMovimiento((initial?.movimiento as MovimientoBasico) ?? 'Ingreso');
    setTipoMovimiento((initial?.tipoMovimiento as TipoMovimiento) ?? '');
    setTipoMovimientoId(initial?.tipoMovimientoId ?? 0);
    setNumero(initial?.numeroComprobante ?? '');
    setDeposito(initial?.depositoId ?? 0);
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
    setAjusteSigno((initial?.ajusteSigno as 'positivo' | 'negativo') ?? 'positivo');
  };

  const canSubmit = () => {
    const hasProducts =
      items.length > 0 &&
      items.every((it) => Number(it.productoId) > 0 && Number(it.cantidad) > 0);
    if (!hasProducts) return false;

    return deposito > 0 && tipoMovimientoId > 0;
  };

  const patchRow = (idx: number, patch: Partial<ProductRow>) => {
    setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addRow = () => setItems((prev) => [...prev, { productoId: 0, cantidad: 1 }]);
  const removeRow = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleBuscarPedido = async () => {
    if (!numeroComprobanteBusqueda) return;
    setIsBuscando(true);
    setPedidoId(0); // Limpiar ID de pedido anterior en cada búsqueda
    try {
      const response = await fetch(`/api/pedidos/${numeroComprobanteBusqueda.trim()}`);
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }
      const pedido = await response.json();

      if (pedido && pedido.items && pedido.items.length > 0) {
        // Autocompletar formulario
        setPedidoId(pedido.id); // Guardar el ID del pedido
        setTipoMovimientoId(6); // Egreso por Venta (ID desde la BD)
        setDeposito(2); // Deposito Norte
        // Se establece el estado 'numero', que se usa para el campo 'numeroComprobante' en el payload del submit.
        // Esto asocia el movimiento de stock con el número de pedido de venta.
        setNumero(numeroComprobanteBusqueda.trim());

        // Mapear items del pedido a items del movimiento
        const nuevosItems = pedido.items.map((item: any) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
        }));
        setItems(nuevosItems);
      } else {
        console.log('Pedido no encontrado o sin items.');
        // No se hace nada en la UI, permitiendo al usuario continuar manualmente
      }
    } catch (error) {
      console.error('Error al buscar el pedido:', error);
    } finally {
      setIsBuscando(false);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    // Determinar ingreso/egreso por el tipo seleccionado (saldo=true => suma)
    const tipoSeleccionado = tiposMovimiento.find((t) => t.id === tipoMovimientoId);
    const esIngreso = tipoSeleccionado?.saldo ?? true;

    const payload: MovimientoPayload = {
      movimiento: esIngreso ? 'Ingreso' : 'Egreso',
      tipoMovimiento,
      depositoId: Number(deposito),
      tipoMovimientoId: Number(tipoMovimientoId),
      numeroComprobante: numero || undefined,
      comprobanteId: comprobanteId || undefined,
      comentario: comentario || undefined,
      productos: items.map((it) => {
        const cantidadAbs = Math.abs(Number(it.cantidad) || 0);
        const qty =
          isAjuste
            ? (ajusteSigno === 'negativo' ? -cantidadAbs : cantidadAbs)
            : (esIngreso ? cantidadAbs : -cantidadAbs);
        return { productoId: Number(it.productoId), cantidad: qty };
      }),
      ajusteSigno: isAjuste ? ajusteSigno : undefined,
      pedidoId: pedidoId ?? undefined,
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

  // Sincroniza nombre/ingreso-egreso cuando cambia el ID de tipo seleccionado
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
            <div className="flex items-end space-x-2">
              <Input
                label="Número de comprobante"
                placeholder="Buscar Pedido (ej: PD-123)"
                value={numeroComprobanteBusqueda}
                onChange={(e) => setNumeroComprobanteBusqueda(e.target.value)}
                className="input-focus flex-grow"
              />
              <Button onClick={handleBuscarPedido} disabled={isBuscando || !numeroComprobanteBusqueda}>
                {isBuscando ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

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
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    movimiento === 'Ingreso'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {movimiento}
                </div>
                <span className="text-gray-700">{tipoMovimiento}</span>
              </div>
            </div>
          )}

          {/* Depósito único */}
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

          {/* Comentario */}
          <Input
            label="Comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="input-focus"
            placeholder="Notas del movimiento..."
          />

          {/* Signo para ajustes */}
          {isAjuste && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Ajuste
              </label>
              <Select
                value={ajusteSigno}
                onChange={(e) => setAjusteSigno(e.target.value as 'positivo' | 'negativo')}
                className="input-focus"
              >
                <option value="positivo">Ajuste Positivo (Sumar stock)</option>
                <option value="negativo">Ajuste Negativo (Restar stock)</option>
              </Select>
            </div>
          )}

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

                const signedQty = isAjuste
                  ? ajusteSigno === 'negativo'
                    ? -Math.abs(cantidadNum)
                    : Math.abs(cantidadNum)
                  : esIngreso
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