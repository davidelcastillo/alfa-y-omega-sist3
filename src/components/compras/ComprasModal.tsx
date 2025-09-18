// src/components/compras/ComprasModal.tsx
"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import type { Product, PurchaseOrderItem } from "@/lib/compras/purchase";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  proveedores: { id: string; name: string }[];
  depositos: string[];
  productos: Product[];

  initial?: {
    proveedorId?: string;
    deposito?: string;
    fechaEntrega?: string; // yyyy-mm-dd
    items?: PurchaseOrderItem[];
  };

  onSubmit: (payload: {
    proveedorId: string;
    deposito: string;
    fechaEntrega: string;
    items: PurchaseOrderItem[];
    totalCantidad: number;
    totalMonto: number;
  }) => void;
};

function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function ComprasModal({
  open,
  onOpenChange,
  proveedores,
  depositos,
  productos,
  initial,
  onSubmit,
}: Props) {
  const [proveedorId, setProveedorId] = useState(initial?.proveedorId ?? "");
  const [deposito, setDeposito] = useState(initial?.deposito ?? "");
  const [fechaEntrega, setFechaEntrega] = useState(initial?.fechaEntrega ?? "");
  const [items, setItems] = useState<PurchaseOrderItem[]>(initial?.items ?? []);

  // ítem en edición
  const [prodSel, setProdSel] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [unit, setUnit] = useState<number>(0);

  const totalCantidad = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalMonto = useMemo(() => items.reduce((s, i) => s + i.totalPrice, 0), [items]);

  function addItem() {
    if (!prodSel) return;
    const prod = productos.find((p) => p.id === prodSel);
    if (!prod) return;
    const unitPrice = unit > 0 ? unit : prod.price ?? 0;
    const newItem: PurchaseOrderItem = {
      id: String(Date.now()),
      productId: prod.id,
      productName: prod.name,
      quantity: Math.max(1, qty),
      unitPrice,
      totalPrice: Math.max(1, qty) * unitPrice,
    };
    setItems((arr) => [...arr, newItem]);
    setProdSel("");
    setQty(1);
    setUnit(0);
  }

  function removeItem(id: string) {
    setItems((arr) => arr.filter((x) => x.id !== id));
  }

  function submit() {
    if (!proveedorId || !deposito || !fechaEntrega || items.length === 0) return;
    onSubmit({ proveedorId, deposito, fechaEntrega, items, totalCantidad, totalMonto });
  }

return (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent
      className="
        glass-effect
        p-0 overflow-hidden
        w-full max-w-3xl md:max-w-5xl
        h-[75vh]
      "
    >
      {/* Header (gradiente como el otro modal) */}
      <div className="flex-none p-6 rounded-t-2xl bg-gradient-to-r from-primary-pink to-light-pink">
        <div className="flex items-center justify-between">
          <AlertDialogTitle className="text-2xl font-bold text-white">
            Registrar Nueva Orden de Compra
          </AlertDialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/20 p-2 rounded-lg"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body scrolleable */}
      <div className="flex-auto overflow-y-auto p-8 space-y-8">
        {/* Cabecera */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Proveedor *"
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
            className="input-focus"
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>

          <Select
            label="Depósito *"
            value={deposito}
            onChange={(e) => setDeposito(e.target.value)}
            className="input-focus"
          >
            <option value="">Seleccionar depósito</option>
            {depositos.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>

          <Input
            label="Fecha de Entrega *"
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            className="input-focus"
          />
        </div>

        {/* Productos (caja igual estilo al otro) */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-4">Productos *</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Select
              label="Producto"
              value={prodSel}
              onChange={(e) => setProdSel(e.target.value)}
              className="input-focus"
            >
              <option value="">Seleccionar…</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - ${money(p.price ?? 0)}
                </option>
              ))}
            </Select>

            <Input
              label="Cantidad"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              className="input-focus"
            />

            <Input
              label="Precio Unitario"
              type="number"
              min={0}
              step="1"
              value={unit}
              onChange={(e) => setUnit(Math.max(0, Number(e.target.value || 0)))}
              //hint="Si lo dejás en 0, se toma el precio del producto"
              className="input-focus"
            />

            <div className="flex items-end">
              <Button className="w-full" onClick={addItem}>
                Agregar producto
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla de ítems + resumen (en “card” con borde/redondeado) */}
        {items.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-800">Producto</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-800">Cantidad</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-800">Precio Unit.</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-800">Subtotal</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">{it.productName}</td>
                      <td className="px-4 py-3 text-gray-700">{it.quantity}</td>
                      <td className="px-4 py-3 text-gray-700">${money(it.unitPrice)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">${money(it.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" onClick={() => removeItem(it.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumen */}
            <div className="p-6 flex justify-end">
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Cantidad Total: {totalCantidad}</div>
                <div className="text-2xl font-bold text-blue-800">Total: ${money(totalMonto)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions (al pie, como el otro diseño) */}
        <div className="flex justify-end gap-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="btn-primary"
            disabled={!proveedorId || !deposito || !fechaEntrega || items.length === 0}
            onClick={submit}
          >
            Registrar Orden de Compra
          </Button>
        </div>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

}
