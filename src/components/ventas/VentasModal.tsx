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

type ProductRow = { productoId: number; cantidad: number; nombre: string; };
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
  const [detalles, setDetalles] = useState<ProductRow[]>([]);
  const [isBuscando, setIsBuscando] = useState(false);
  const [pedidoDbId, setPedidoDbId] = useState<number | null>(null);
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [depositoNombre, setDepositoNombre] = useState('');

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
      detalles.length > 0 &&
      detalles.every((it) => Number(it.productoId) > 0 && Number(it.cantidad) > 0);
    if (!hasProducts || isBuscando) return false;
    return deposito > 0 && tipoMovimientoId > 0;
  };

  const handleBuscarPedido = async (numeroComprobante: string) => {
    if (!numeroComprobante) return;
    setIsBuscando(true);
    setDetalles([]);
    setDireccionEnvio('');
    setPedidoDbId(null);
    setComentario('');
    setDepositoNombre('');

    try {
      const response = await fetch(`/api/pedidos/${numeroComprobante.trim()}`);
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }
      const data = await response.json();

      if (data && data.pedido && data.pedido.items && data.pedido.items.length > 0) {
        const { pedido, deposito } = data;

        setPedidoDbId(pedido.id);
        setNumero(numeroComprobante.trim());
        setComentario(`Movimiento de stock automático por venta del Pedido N° ${numeroComprobante.trim()}`);

        const productosCargados = pedido.items.map((item: any) => ({
          productoId: item.producto.id,
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
        }));
        setDetalles(productosCargados);

        if (pedido.direccionEnvio) {
          const dir = pedido.direccionEnvio;
          const direccionCompleta = [
            dir.calle,
            dir.numero,
            dir.piso ? `Piso ${dir.piso}` : '',
            dir.depto ? `Depto ${dir.depto}` : '',
            dir.ciudad,
            dir.provincia,
            `(${dir.codigoPostal || ''})`
          ].filter(Boolean).join(' ');
          setDireccionEnvio(direccionCompleta);
        } else {
          setDireccionEnvio('Dirección no especificada');
        }

        if (deposito) {
          setDepositoNombre(deposito.nombre);
          setDeposito(1); // Hardcode to ID 1
        }
      } else {
        console.log('Pedido no encontrado o sin items.');
      }
    } catch (error) {
      console.error('Error al buscar el pedido:', error);
    } finally {
      setIsBuscando(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    try {
      // Step 1: Register the stock movement
      const movimientoData = {
        tipoMovimientoId: 2, // Hardcoded: "Egreso por Venta"
        depositoId: 1,       // Hardcoded: Depósito "idUno"
        numeroComprobante: numero,
        detalles: detalles.map(p => ({
          productoId: p.productoId,
          cantidad: p.cantidad * -1, // Ensure egress is negative
        })),
        comentario: comentario,
      };

      const movResponse = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimientoData),
      });

      if (!movResponse.ok) {
        throw new Error('Error al registrar el movimiento de stock');
      }

      // Step 2: Update the order status
      if (pedidoDbId) {
        const pedidoResponse = await fetch(`/api/ventas/${pedidoDbId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estadoPedidoId: 18 }), // 18 = "Enviado"
        });

        if (!pedidoResponse.ok) {
          console.error('Movimiento registrado, pero falló la actualización del estado del pedido.');
        }
      }

      // toast.success('Envío registrado y pedido actualizado con éxito.');
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error en el proceso de envío:', error);
      // toast.error('Hubo un error al registrar el envío.');
    }
  };

  // ---- Efectos ----
  useEffect(() => {
    if (isOpen && pedidoIdProp) {
      handleBuscarPedido(pedidoIdProp);
    } else if (!isOpen) {
      setDetalles([]);
      setDireccionEnvio('');
      setPedidoDbId(null);
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

          {!isBuscando && detalles.length === 0 && pedidoIdProp && (
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
          <Input
            label="Depósito *"
            value={depositoNombre}
            readOnly
            disabled
            className="input-focus bg-gray-100"
          />

          {/* Dirección de envío */}
          <Input
            label="Dirección de Envío"
            value={direccionEnvio}
            readOnly
            disabled
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
              {detalles.map((row, idx) => {
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
