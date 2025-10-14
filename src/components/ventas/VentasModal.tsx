"use client";

import { useMemo, useState } from "react";

type WarehouseProduct = { id: string; name: string; stock: number; price: number };
type Warehouse = { id: string; name: string; products: WarehouseProduct[] };

type OrderProduct = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  cardNumber: string;
  products: OrderProduct[];
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

  const currentWarehouse = useMemo(
    () => warehouses.find((w) => w.id === warehouseId) || null,
    [warehouseId, warehouses]
  );

  const total = useMemo(() => items.reduce((s, p) => s + (p.subtotal || 0), 0), [items]);

  // sincroniza al abrir con productos del pedido
  // (si el padre cambia "order", actualizamos)
  useMemo(() => {
    if (order) setItems(order.products);
  }, [order?.id]); // eslint-disable-line

  if (!open || !order) return null;

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
      merged.subtotal = (merged.quantity || 0) * (merged.unitPrice || 0);
      copy[idx] = merged;
      return copy;
    });
  };

  const whProducts = currentWarehouse?.products ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-300 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">Realizar Envío — {order.orderNumber}</h3>
            <button
              onClick={() => {
                setWarehouseId("");
                setItems(order.products);
                onClose();
              }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Resumen pedido */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">Información del Pedido</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Cliente:</span>
                <span className="ml-2 text-gray-900">{order.customerName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tarjeta:</span>
                <span className="ml-2 text-gray-900">{order.cardNumber}</span>
              </div>
            </div>
          </div>

          {/* Depósito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Depósito *</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
            >
              <option value="">Seleccionar depósito</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          {warehouseId && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Productos del envío</h4>
                <button
                  onClick={addLine}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  + Agregar producto
                </button>
              </div>

              <div className="space-y-4">
                {items.map((it, idx) => (
                  <div key={it.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          value={it.name}
                          onChange={(e) => {
                            const wp = whProducts.find((p) => p.name === e.target.value);
                            if (wp) patchLine(idx, { name: wp.name, unitPrice: wp.price });
                          }}
                        >
                          <option value="">Seleccionar producto</option>
                          {whProducts.map((wp) => (
                            <option key={wp.id} value={wp.name}>
                              {wp.name} (Stock: {wp.stock})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                        <input
                          type="number"
                          min={1}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          value={it.quantity || 0}
                          onChange={(e) => {
                            const wp = whProducts.find((p) => p.name === it.name);
                            const max = wp?.stock ?? 0;
                            const val = Math.max(0, Math.min(Number(e.target.value) || 0, max));
                            patchLine(idx, { quantity: val });
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                        <input
                          type="number"
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          value={it.unitPrice || 0}
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
                          <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg font-semibold">
                            {it.subtotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                          </div>
                        </div>
                        <button
                          onClick={() => removeLine(idx)}
                          className="ml-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total del envío:</span>
              <span className="text-2xl font-bold text-green-600">
                {total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={() => {
                setWarehouseId("");
                setItems(order.products);
                onClose();
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancelar
            </button>

            <button
              disabled={!warehouseId || items.length === 0}
              onClick={() =>
                onConfirm({
                  orderId: order.id,
                  warehouseId,
                  products: items,
                  total,
                })
              }
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Envío
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
