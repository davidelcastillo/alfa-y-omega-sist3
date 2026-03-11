// src/components/compras/ComprasModal.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react"; // 🟢 AGREGADO useEffect/useRef
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Product, PurchaseOrderItem } from "@/lib/compras/purchase";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  proveedores: { id: string; name: string }[];
  depositos: { id: string; name: string }[];
  productos: Product[]; // ⚠️ Se mantiene por compatibilidad pero ya no se usa directo

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

// 🟢 AGREGADO: tipo de sugerencia que devuelve /api/productos/buscador
type Suggestion = {
  id: string;
  name: string;
  code?: string;
  price: number;
};

export default function ComprasModal({
  open,
  onOpenChange,
  proveedores,
  depositos,
  productos,
  initial,
  onSubmit,
}: Props) {
  // ===================== Estados de cabecera =====================
  const [proveedorId, setProveedorId] = useState(initial?.proveedorId ?? "");
  const [deposito, setDeposito] = useState(initial?.deposito ?? "");
  const [fechaEntrega, setFechaEntrega] = useState(initial?.fechaEntrega ?? "");
  const [items, setItems] = useState<PurchaseOrderItem[]>(initial?.items ?? []);

  // ===================== Estado ítem en edición =====================
  const [selectedProduct, setSelectedProduct] = useState<Suggestion | null>(null); // 🟢 AGREGADO
  const [qty, setQty] = useState<number>(1);
  const [unit, setUnit] = useState<number>(0);

  const totalCantidad = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalMonto = useMemo(() => items.reduce((s, i) => s + i.totalPrice, 0), [items]);

  // ===================== Typeahead Productos (BUSCADOR BD) =====================
  const [query, setQuery] = useState("");                // 🟢 texto del input
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]); // 🟢 lista sugerencias
  const [showSug, setShowSug] = useState(false);         // 🟢 mostrar dropdown
  const [loading, setLoading] = useState(false);         // 🟢 indicador loading
  const sugRef = useRef<HTMLDivElement>(null);           // 🟢 cerrar al click afuera
  const abortRef = useRef<AbortController | null>(null); // 🟢 cancelar fetch anterior

  // 🟢 debounce sencillo inline
  function useDebouncedValue<T>(value: T, delay = 250) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const t = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
  }
  const debouncedQuery = useDebouncedValue(query, 250);

  // 🟢 Fetch a /api/productos/buscador?q=...
  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);

        // cancela request anterior si seguía en vuelo
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        const url = new URL("/api/productos/buscador", window.location.origin);
        // ⚠️ Ahora incluso con vacío trae los primeros productos
        if (debouncedQuery.trim()) url.searchParams.set("q", debouncedQuery);
        url.searchParams.set("take", "8");

        const res = await fetch(url.toString(), { cache: "no-store", signal: ac.signal });
        if (!res.ok) throw new Error(`GET /api/productos/buscador ${res.status}`);

        const json = await res.json();
        // 👇 Adaptado a tu backend (usa .data o .items)
        const arr = Array.isArray(json) ? json : (json.data ?? json.items ?? []);
        const mapped: Suggestion[] = arr.map((p: any) => ({
          id: String(p.id),
          name: String(p.nombre ?? p.name ?? "—"),
          code: String(p.codigo ?? p.code ?? ""),
          price: Number(p.precio ?? p.price ?? 0),
        }));

        if (active) {
          setSuggestions(mapped);
          setShowSug(true);
        }
      } catch (err) {
        if (active) setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!open) {
      setProveedorId("");
      setDeposito("");
      setFechaEntrega("");
      setItems([]);
      setSelectedProduct(null);
      setQuery("");
      setQty(1);
      setUnit(0);
    }
  }, [open]);

  // 🟢 cerrar sugerencias al click afuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!sugRef.current) return;
      if (!sugRef.current.contains(e.target as Node)) setShowSug(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 🟢 seleccionar una sugerencia
  function pickSuggestion(s: Suggestion) {
    setSelectedProduct(s);
    setQuery(s.name);
    setUnit(Number(s.price ?? 0));
    setShowSug(false);
  }

  // 🔁 agrega usando selectedProduct
  function addItem() {
    if (!selectedProduct) return;
    const unitPrice = unit > 0 ? unit : selectedProduct.price ?? 0;
    const newItem: PurchaseOrderItem = {
      id: String(Date.now()),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: Math.max(1, qty),
      unitPrice,
      totalPrice: Math.max(1, qty) * unitPrice,
    };
    setItems((arr) => [...arr, newItem]);
    // reset línea
    setSelectedProduct(null);
    setQuery("");
    setQty(1);
    setUnit(0);
    setSuggestions([]);
  }

  function removeItem(id: string) {
    setItems((arr) => arr.filter((x) => x.id !== id));
  }

  function submit() {
    if (!proveedorId || !deposito || !fechaEntrega || items.length === 0) return;
    onSubmit({ proveedorId, deposito, fechaEntrega, items, totalCantidad, totalMonto });
  }

  if (!open) return null;

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
                <option key={d.id} value={d.id}>{d.name}</option>
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

          {/* Productos (typeahead) */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Productos *</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {/* Input con dropdown de sugerencias */}
              <div className="relative" ref={sugRef}>
                <label className="text-sm font-medium">Producto</label>
                <Input
                  placeholder="Escribí para buscar…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSug(true);
                    setSelectedProduct(null);
                  }}
                  onFocus={() => setShowSug(true)}
                  className="input-focus"
                />
                {/* Dropdown de sugerencias */}
                {showSug && (loading || suggestions.length > 0) && (
                  <div className="absolute z-20 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-64 overflow-auto">
                    {loading && (
                      <div className="px-3 py-2 text-sm text-gray-500">Buscando…</div>
                    )}
                    {!loading && suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                        onClick={() => pickSuggestion(s)}
                      >
                        <div className="font-medium">{s.name}</div>
                        {/* 🔴 Eliminado el precio para no mostrar $0 */}
                        <div className="text-xs text-gray-500">
                          {s.code ? `Cod: ${s.code}` : ""}
                        </div>
                      </button>
                    ))}
                    {!loading && suggestions.length === 0 && debouncedQuery.trim() && (
                      <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
                    )}
                  </div>
                )}
              </div>

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
                className="input-focus"
              />

              <div className="flex items-end">
                <Button className="w-full" onClick={addItem} disabled={!selectedProduct}>
                  Agregar producto
                </Button>
              </div>
            </div>
          </div>

          {/* Tabla de ítems + resumen */}
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

          {/* Actions */}
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
