"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

type WarehouseProduct = { id: string; name: string; stock: number; price: number };
type Warehouse = { id: string; name: string; products: WarehouseProduct[] };

type OrderProduct = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

type HistoryEvent = { date: string; action: string; user: string };

// ⬇️ Ampliamos con campos OPCIONALES para reflejar lo que muestra VentasDetalles
type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  cardNumber: string;
  products: OrderProduct[];
  // opcionales (no rompen código existente)
  total?: number;
  orderDate?: string;
  orderTime?: string;
  status?: "Enviado" | "Pendiente de enviar" | "En Preparación";
  shippedDate?: string;
  warehouse?: string;
  registrationDate?: string;
  history?: HistoryEvent[];
};

type VentasModalProps = {
  open: boolean;
  order: Order | null;
  warehouses: Warehouse[];
  onClose: () => void;
  onConfirm: (data: {
    orderId: string;
    warehouseId: string;
    products: OrderProduct[];
    total: number;
  }) => void;
};

export default function VentasModal({
  open,
  order,
  warehouses,
  onClose,
  onConfirm,
}: VentasModalProps) {
  const [warehouseId, setWarehouseId] = useState<string>("");
  const [items, setItems] = useState<OrderProduct[]>(order?.products ?? []);
  const [showPedidoProducts, setShowPedidoProducts] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  const currentWarehouse = useMemo(
    () => warehouses.find((w) => w.id === warehouseId) || null,
    [warehouseId, warehouses]
  );

  const whProducts = currentWarehouse?.products ?? [];

  const total = useMemo(
    () => items.reduce((s, p) => s + (p.subtotal || 0), 0),
    [items]
  );

  // Sincroniza cuando cambia el pedido abierto
  useEffect(() => {
    if (order) {
      setItems(order.products);
      setShowPedidoProducts(true);
      setShowHistory(true);
    }
  }, [order?.id]); // mantener dependencia por id para no re-sobrescribir mientras se edita

  if (!open || !order) return null;

  const moneyAR = (n: number) =>
    (n || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  const addLine = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", quantity: 1, unitPrice: 0, subtotal: 0 },
    ]);
  };

  const removeLine = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const patchLine = (idx: number, next: Partial<OrderProduct>) => {
    setItems((prev) => {
      const copy = [...prev];
      const merged = { ...copy[idx], ...next };
      merged.subtotal = (Number(merged.quantity) || 0) * (Number(merged.unitPrice) || 0);
      copy[idx] = merged;
      return copy;
    });
  };

  const handleClose = () => {
    setWarehouseId("");
    setItems(order.products);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">
            Realizar Envío — {order.orderNumber}
          </h3>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors p-2"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {/* Cards resumen como en VentasDetalles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center">
              <p className="text-sm font-medium text-blue-600 mb-2">Total del pedido</p>
              <p className="text-3xl font-bold text-blue-800">{moneyAR(order.total ?? order.products.reduce((s,p)=>s+p.subtotal,0))}</p>
            </div>
            <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <p className="text-lg font-semibold text-gray-900">{order.status ?? "-"}</p>
              {order.status === "Enviado" && order.shippedDate && (
                <p className="text-sm text-gray-500 mt-1">Enviado el {order.shippedDate}</p>
              )}
            </div>
            <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Depósito</p>
              <p className="text-lg font-semibold text-gray-900">{order.warehouse ?? "-"}</p>
            </div>
          </div>

          {/* Información del pedido */}
          <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Información del pedido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Fecha de pedido</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.orderDate ?? "-"}{" "}
                    {order.orderTime && (
                      <span className="text-sm text-gray-500">{order.orderTime}</span>
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Cliente</span>
                  <p className="text-lg font-semibold text-gray-900">{order.customerName}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Tarjeta</span>
                  <p className="text-lg font-semibold text-gray-900">{order.cardNumber}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Estado</span>
                  <p className="text-lg font-semibold text-gray-900">{order.status ?? "-"}</p>
                  {order.status === "Enviado" && order.shippedDate && (
                    <p className="text-sm text-gray-500">Enviado el {order.shippedDate}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600">Depósito</span>
                  <p className="text-lg font-semibold text-gray-900">{order.warehouse ?? "-"}</p>
                </div>
              </div>
            </div>

            {order.registrationDate && (
              <p className="mt-4 text-gray-700">
                <span className="font-medium">Fecha de registro:</span>{" "}
                {order.registrationDate}
              </p>
            )}
          </div>

          {/* Productos del pedido (read-only, como en VentasDetalles) */}
          <div className="rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-white/50 shadow-sm">
            <div className="bg-gradient-to-r from-pink-500 to-pink-300 p-4 flex items-center justify-between">
              <h3 className="text-white font-bold">Productos del pedido</h3>
              <button
                className="text-white/90 hover:text-white text-sm"
                onClick={() => setShowPedidoProducts(v => !v)}
              >
                {showPedidoProducts ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {showPedidoProducts && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Producto", "Cantidad", "Precio unitario", "Subtotal"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((it, idx) => (
                      <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3">{it.name}</td>
                        <td className="px-4 py-3">{it.quantity}</td>
                        <td className="px-4 py-3">{moneyAR(it.unitPrice)}</td>
                        <td className="px-4 py-3 font-semibold">{moneyAR(it.subtotal)}</td>
                      </tr>
                    ))}
                    {order.products.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                          Sin productos asociados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Selección de depósito + total envío (editable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Depósito *"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              required
            >
              <option value="">Seleccionar depósito</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>

            <Input
              label="Total del envío"
              readOnly
              value={moneyAR(total)}
            />
          </div>

          {/* Productos del envío (editable) */}
          {warehouseId && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  Productos del envío
                </h4>
                <Button onClick={addLine} className="px-4 py-2">
                  + Agregar producto
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((it, idx) => {
                  const selected = whProducts.find((p) => p.name === it.name);
                  const stockMax = selected?.stock ?? 0;

                  return (
                    <div key={it.id} className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-5">
                          <Select
                            label="Producto"
                            value={it.name}
                            onChange={(e) => {
                              const wp = whProducts.find((p) => p.name === e.target.value);
                              if (wp) {
                                patchLine(idx, { name: wp.name, unitPrice: wp.price, quantity: 1 });
                              } else {
                                patchLine(idx, { name: "", unitPrice: 0, quantity: 0 });
                              }
                            }}
                          >
                            <option value="">Seleccionar producto</option>
                            {whProducts.map((wp) => (
                              <option key={wp.id} value={wp.name}>
                                {wp.name} (Stock: {wp.stock})
                              </option>
                            ))}
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            label="Cantidad"
                            type="number"
                            min={0}
                            value={it.quantity || 0}
                            onChange={(e) => {
                              const raw = Number(e.target.value) || 0;
                              const val = Math.max(0, Math.min(raw, stockMax));
                              patchLine(idx, { quantity: val });
                            }}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            label="Precio"
                            type="number"
                            readOnly
                            value={it.unitPrice || 0}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            label="Subtotal"
                            readOnly
                            value={moneyAR(it.subtotal || 0)}
                          />
                        </div>

                        <div className="md:col-span-1 flex md:justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeLine(idx)}
                            aria-label="Eliminar producto"
                            className="w-full md:w-auto"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Total envío destacado */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total del envío</span>
              <span className="text-2xl font-bold text-green-700">{moneyAR(total)}</span>
            </div>
          </div>

          {/* Historial (si existe) */}
          {order.history?.length ? (
            <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-800">Historial</h3>
                <button
                  className="text-blue-700 hover:text-blue-900 text-sm"
                  onClick={() => setShowHistory(v => !v)}
                >
                  {showHistory ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {showHistory && (
                <ul className="space-y-2">
                  {order.history.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-sm text-gray-500 min-w-[140px]">{h.date}</span>
                      <span className="text-gray-800">{h.action}</span>
                      <span className="text-gray-500 text-sm">— {h.user}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} className="px-8">
              Cancelar
            </Button>
            <Button
              disabled={!warehouseId || items.length === 0}
              onClick={() =>
                onConfirm({
                  orderId: order.id,
                  warehouseId,
                  products: items,
                  total,
                })
              }
              className="px-8"
            >
              Confirmar Envío
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
