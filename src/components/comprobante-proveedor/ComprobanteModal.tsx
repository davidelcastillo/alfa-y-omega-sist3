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
import type {  Product,
              DetalleComprobanteProveedor,
              ComprobanteProveedor,
              TipoMovimiento,
              TipoComprobante,
              MetodoPago,
              PurchaseOrder,
            } from "@/lib/comprobante-proveedor/comprobante";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  proveedores: { id: string; name: string }[];
  depositos: { id: string; name: string }[];
  productos: Product[];
  tipoMovimientos: { id: string; name: string; saldo: boolean }[];
  tipoComprobantes: { id: string; name: string }[];
  metodoPagos: { id: string; name: string }[];
  ordenCompra: PurchaseOrder[];

  initial?: {
    proveedorId?: string;
    depositoId?: string;
    fecha?: string; // yyyy-mm-dd
    tipoMovimientoId?: string;
    tipoComprobanteId?: string;
    metodoPagoId?: string;
    ordenCompraId?: string;
    items?: DetalleComprobanteProveedor[];
    letra?: string;
    numeroSucursal?: string;
    numero?: string;
    moneda?: string;
    observaciones?: string;
  };

  onSubmit: (payload: {
    proveedorId: string;
    depositoId: string;
    fecha: string;
    items: DetalleComprobanteProveedor[];
    totalCantidad: number;
    totalMonto: number;
    tipoMovimientoId: string;
    tipoComprobanteId: string;
    metodoPagoId: string;
    ordenCompraId: string;
    letra?: string | null;
    numeroSucursal?: string | null;
    numero?: string;
    moneda?: string | null;
    observaciones?: string | null;
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
  tipoMovimientos,
  tipoComprobantes,
  metodoPagos,
  ordenCompra,
  initial,
  onSubmit,
}: Props) {
  const [proveedorId, setProveedorId] = useState(initial?.proveedorId ?? "");
  const [depositoId, setDepositoId] = useState(initial?.depositoId ?? "");
  const [fecha, setFecha] = useState(initial?.fecha ?? "");
  const [tipoComprobanteId, setTipoComprobanteId] = useState(initial?.tipoComprobanteId ?? "");
  const [metodoPagoId, setMetodoPagoId] = useState(initial?.metodoPagoId ?? "");
  const [ordenCompraId, setOrdenCompraId] = useState(initial?.ordenCompraId ?? "");
  const [items, setItems] = useState<DetalleComprobanteProveedor[]>(initial?.items ?? []);

  // Campos adicionales del DTO
  const [letra, setLetra] = useState(initial?.letra ?? "");
  const [numeroSucursal, setNumeroSucursal] = useState(initial?.numeroSucursal ?? "");
  const [numero, setNumero] = useState(initial?.numero ?? "");
  const [moneda, setMoneda] = useState(initial?.moneda ?? "ARS");
  const [observaciones, setObservaciones] = useState(initial?.observaciones ?? "");
    // Tipo de movimiento: por defecto ingreso por compra (id = 1)
  const [tipoMovimientoId, setTipoMovimientoId] = useState(initial?.tipoMovimientoId ?? "1");

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
    const newItem: DetalleComprobanteProveedor = {
      id: String(Date.now()),
      productId: prod.id,
      productName: prod.name,
      quantity: Math.max(1, qty),
      unitPrice,
      totalPrice: Math.max(1, qty) * unitPrice,
      discount: 0,
      observations: "",
    };
    setItems((arr) => [...arr, newItem]);
    setProdSel("");
    setQty(1);
    setUnit(0);
  }

  function removeItem(id: string) {
    setItems((arr) => arr.filter((x) => x.id !== id));
  }

  async function createComprobante() {
    if (!proveedorId || !depositoId || !fecha || !tipoComprobanteId || !metodoPagoId || !ordenCompraId || items.length === 0) {
      alert("Completar todos los campos obligatorios y agregar al menos un producto");
      return;
    }

    try {
      const res = await fetch("/api/comprobantes-proveedor/nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedorId: Number(proveedorId),
          depositoId: Number(depositoId),
          fecha,
          tipoComprobanteId: Number(tipoComprobanteId),
          metodoPagoId: Number(metodoPagoId),
          ordenCompraId: Number(ordenCompraId),
          tipoMovimientoId: Number(tipoMovimientoId),
          letra: letra || null,
          numeroSucursal: numeroSucursal || null,
          numero: numero || null,
          moneda: moneda || null,
          observaciones: observaciones || null,
          detalles: items.map(i => ({
            productoId: i.productId,
            cantidad: i.quantity,
            precioUnitario: i.unitPrice,
            descuento: i.discount ?? 0,
            observaciones: i.observations ?? "",
          })),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Comprobante creado correctamente");
        onOpenChange(false);
      } else {
        alert("Error: " + (data.error ?? "Desconocido"));
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
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
            Registrar Nuevo Comprobante de Proveedor
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
            label="Orden de Compra *"
            value={ordenCompraId}
            onChange={(e) => setOrdenCompraId(e.target.value)}
            className="input-focus"
          >
            <option value="">Seleccionar Orden de Compra</option>
            {ordenCompra.map((o) => (
              //MODIFICAR PARA QUE MUESTRE MÁS INFO SOBRE ORDEN DE COMPRA
              <option key={o.id} value={o.id}>{o.id}</option>
            ))}
          </Select>

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
            value={depositoId}
            onChange={(e) => setDepositoId(e.target.value)}
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
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="input-focus"
          />

          <Select label="Tipo Comprobante *" value={tipoComprobanteId} onChange={e => setTipoComprobanteId(e.target.value)} className="input-focus">
              <option value="">Seleccionar</option>
              {tipoComprobantes.filter(tc => ["1","3","4"].includes(tc.id)).map(tc => (
                <option key={tc.id} value={tc.id}>{tc.name}</option>
              ))}
          </Select>

          <Select label="Metodo Pago *" value={metodoPagoId} onChange={e => setMetodoPagoId(e.target.value)} className="input-focus">
              <option value="">Seleccionar</option>
              {metodoPagos.map(mp => (
                <option key={mp.id} value={mp.id}>{mp.name}</option>
              ))}
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Input label="Letra" value={letra} maxLength={1} onChange={e => setLetra(e.target.value)} className="input-focus" />
            <Input label="Número Sucursal" maxLength={4} value={numeroSucursal} onChange={e => setNumeroSucursal(e.target.value)} className="input-focus" />
            <Input label="Número" maxLength={8} value={numero} onChange={e => setNumero(e.target.value)} className="input-focus" />
            <Input label="Moneda" value={moneda} onChange={e => setMoneda(e.target.value)} className="input-focus" />
            <Input label="Observaciones" value={observaciones} onChange={e => setObservaciones(e.target.value)} className="input-focus" />
            <Input type="hidden" name="tipoMovimientoId" value="1" />
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

             <Input
              label="Observaciones"
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
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
            disabled={!proveedorId || !depositoId || !fecha || items.length === 0}
            onClick={createComprobante}
          >
            Registrar Comprobante de Proveedor
          </Button>
        </div>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

}
