// src/components/compras/ComprasModal.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
  Product,
  DetalleComprobanteProveedor,
  PurchaseOrder,
} from "@/lib/comprobante-proveedor/comprobante";

type SimpleOption = { id: string; name: string };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  proveedores: { id: string; name: string }[];
  depositos: { id: string; name: string }[];
  productos: Product[];
  tipoComprobantes: SimpleOption[]; // pueden venir vacíos; el modal intentará cargar desde la API si hace falta
  tipoMovimientos: { id: string; name: string }[];
  metodoPagos: SimpleOption[];
  ordenCompra: PurchaseOrder[]; // shape variable

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
  tipoComprobantes,
  metodoPagos,
  ordenCompra,
  initial,
  onSubmit,
}: Props) {
  const [proveedorId, setProveedorId] = useState(initial?.proveedorId ?? "");
  const [ordenCompraId, setOrdenCompraId] = useState(initial?.ordenCompraId ?? "");
  const [depositoId, setDepositoId] = useState(initial?.depositoId ?? "");
  const [fecha, setFecha] = useState(initial?.fecha ?? "");
  const [tipoComprobanteId, setTipoComprobanteId] = useState(initial?.tipoComprobanteId ?? "");
  const [metodoPagoId, setMetodoPagoId] = useState(initial?.metodoPagoId ?? "");
  const [items, setItems] = useState<DetalleComprobanteProveedor[]>(initial?.items ?? []);

  const [letra, setLetra] = useState(initial?.letra ?? "");
  const [numeroSucursal, setNumeroSucursal] = useState(initial?.numeroSucursal ?? "");
  const [numero, setNumero] = useState(initial?.numero ?? "");
  const [moneda, setMoneda] = useState(initial?.moneda ?? "ARS");
  const [observaciones, setObservaciones] = useState(initial?.observaciones ?? "");
  const [tipoMovimientoId, setTipoMovimientoId] = useState(initial?.tipoMovimientoId ?? "1");

  // Local copies for opciones (permiten actualizar desde API)
  const [tipoComprobantesLocal, setTipoComprobantesLocal] = useState<SimpleOption[]>(
    tipoComprobantes?.map(t => ({ id: String(t.id), name: t.name })) ?? []
  );
  const [metodoPagosLocal, setMetodoPagosLocal] = useState<SimpleOption[]>(
    metodoPagos?.map(m => ({ id: String(m.id), name: m.name })) ?? []
  );

  const totalCantidad = useMemo(() => items.reduce((s, i) => s + (i.quantity ?? 0), 0), [items]);
  const totalMonto = useMemo(() => items.reduce((s, i) => s + (i.totalPrice ?? 0), 0), [items]);

  // Helper: normaliza id a string
    // helpers al inicio del componente (fuera del return)
function toId(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

// dedupe ordenes por id (mantiene la primera aparición)
const uniqueOrdenes = useMemo(() => {
  const map = new Map<string, any>();
  for (const o of ordenCompra) {
    const key = toId(o?.id);
    if (!map.has(key)) map.set(key, o);
  }
  return Array.from(map.values());
}, [ordenCompra]);

  // Robust label para OC: intenta múltiples nombres/fields
  function formatOCLabel(o: any) {
    // posible nombres de proveedor en distintos shapes
    const supplierName =
      o.supplier?.name ??
      o.proveedor?.nombre ??
      o.proveedor?.name ??
      o.supplierName ??
      o.proveedorNombre ??
      proveedores.find(p => toId(p.id) === toId(o.supplier?.id ?? o.proveedor?.id ?? o.proveedorId ?? o.supplierId))?.name ??
      "Proveedor desconocido";

    const depositoName =
      o.deposito?.nombre ??
      o.deposito?.name ??
      o.depositoName ??
      depositos.find(d => toId(d.id) === toId(o.deposito?.id ?? o.depositoId))?.name ??
      "Depósito desconocido";

    return `${o.id} - ${supplierName} - ${depositoName}`;
  }

  // Si cambia ordenCompraId: pedir datos de la OC al endpoint que ya tenés,
  // y si vienen "opciones" con tipos/metodos, guardarlos localmente.
  useEffect(() => {
  if (!ordenCompraId) {
    setDepositoId("");
    setItems([]);
    setProveedorId("");
    return;
  }

  let cancelled = false;
  (async () => {
    try {
      const res = await fetch(`/api/comprobantes-proveedor/nuevo?ordenCompraId=${ordenCompraId}`);
      const text = await res.text();
      // log raw for debugging (ver si JSON es exactamente lo que esperás)
      console.log('[API /nuevo raw]', res.status, text);

      if (!res.ok) {
        console.warn('API /nuevo no ok', res.status);
        throw new Error('API no ok');
      }

      const payload = JSON.parse(text);
      console.log('[API /nuevo parsed payload]', payload);

      if (cancelled) return;

      if (payload?.ok && payload?.data?.oc) {
        const oc = payload.data.oc;

        // PROVEEDOR y DEPOSITO (mapeo directo a strings)
        const provId = oc.proveedor?.id ? String(oc.proveedor.id) : (oc.proveedorId ? String(oc.proveedorId) : "");
        const depId = oc.deposito?.id ? String(oc.deposito.id) : (oc.depositoId ? String(oc.depositoId) : "");

        setProveedorId(provId);
        setDepositoId(depId);

        // ITEMS: adapta shape devuelto
        const ocItems = (oc.items ?? []).map((it: any, idx: number) => ({
          id: String(it.productoId ?? it.productId ?? idx),
          productId: Number(it.productoId ?? it.productId ?? 0),
          productName: it.producto ?? it.productoNombre ?? it.productName ?? 'Producto',
          quantity: Number(it.cantidad ?? it.quantity ?? 1),
          unitPrice: Number(it.precioUnitario ?? it.unitPrice ?? 0),
          totalPrice: Number(it.cantidad ?? it.quantity ?? 1) * Number(it.precioUnitario ?? it.unitPrice ?? 0),
          discount: 0,
          observations: it.observaciones ?? it.observation ?? '',
        }));
        setItems(ocItems);

        // OPCIONES: tiposComprobante, metodosPago (mapeamos nombre -> name)
        const tcs = payload.data.opciones?.tiposComprobante ?? payload.data.opciones?.tiposComprobante ?? [];
        const mps = payload.data.opciones?.metodosPago ?? payload.data.opciones?.metodosPago ?? [];

        if (Array.isArray(tcs) && tcs.length) {
          setTipoComprobantesLocal(tcs.map((t: any) => ({ id: String(t.id), name: t.nombre ?? t.name ?? String(t.id) })));
        }
        if (Array.isArray(mps) && mps.length) {
          setMetodoPagosLocal(mps.map((m: any) => ({ id: String(m.id), name: m.nombre ?? m.name ?? String(m.id) })));
        }

        return;
      }

      // fallback local: si no viene la OC desde la API, busca en props 'ordenCompra'
      const ocLocal = ordenCompra.find((o) => String(o.id) === String(ordenCompraId));
      if (ocLocal) {
        const provId = String(ocLocal.supplier?.id ?? ocLocal.supplier?.id ?? ocLocal.supplier.id ?? "");
        const depId = String(ocLocal.deposito?.id ?? ocLocal.deposito.id ?? "");
        setProveedorId(provId);
        setDepositoId(depId);

        const localItems = (ocLocal.items ?? []).map((it: any, idx: number) => ({
          id: String(it.productId ?? it.productoId ?? idx),
          productId: it.productId ?? it.productoId ?? 0,
          productName: it.productName ?? it.producto ?? "Producto",
          quantity: Number(it.quantity ?? it.cantidad ?? 1),
          unitPrice: Number(it.unitPrice ?? it.precioUnitario ?? 0),
          totalPrice: Number(it.quantity ?? it.cantidad ?? 1) * Number(it.unitPrice ?? it.precioUnitario ?? 0),
          discount: 0,
          observations: it.observations ?? it.observaciones ?? "",
        }));
        setItems(localItems);
      } else {
        setDepositoId("");
        setItems([]);
        setProveedorId("");
      }
    } catch (err) {
       console.error('Error fetch OC en modal:', err);
      // fallback local si existe
      const ocLocal = ordenCompra.find((o) => String(o.id) === String(ordenCompraId));
      if (ocLocal) {
        const provId = String(ocLocal.supplier?.id ?? ocLocal.proveedor?.id ?? ocLocal.proveedorId ?? "");
        const depId = String(ocLocal.deposito?.id ?? ocLocal.depositoId ?? "");
        setProveedorId(provId);
        setDepositoId(depId);
        const localItems = (ocLocal.items ?? []).map((it: any, idx: number) => ({
          id: String(it.productId ?? it.productoId ?? idx),
          productId: it.productId ?? it.productoId ?? 0,
          productName: it.productName ?? it.producto ?? "Producto",
          quantity: Number(it.quantity ?? it.cantidad ?? 1),
          unitPrice: Number(it.unitPrice ?? it.precioUnitario ?? 0),
          totalPrice: Number(it.quantity ?? it.cantidad ?? 1) * Number(it.unitPrice ?? it.precioUnitario ?? 0),
          discount: 0,
          observations: it.observations ?? it.observaciones ?? "",
        }));
        setItems(localItems);
      } else {
        setDepositoId("");
        setItems([]);
        setProveedorId("");
      }
    }
  })();

  return () => { cancelled = true; };
}, [ordenCompraId, ordenCompra]);

  function updateItem(id: string, field: "quantity" | "observations", value: any) {
    setItems((arr) =>
      arr.map((it) =>
        it.id === id
          ? {
              ...it,
              [field]: field === "quantity" ? Number(value) : value,
              totalPrice:
                field === "quantity" ? Number(value) * it.unitPrice : it.totalPrice,
            }
          : it
      )
    );
  }


  async function createComprobante() {
    if (!proveedorId || !depositoId || !fecha || !tipoComprobanteId || !metodoPagoId || !ordenCompraId || items.length === 0) {
      alert("Completar todos los campos obligatorios y agregar al menos un producto");
      return;
    }

    const body = {
      ordenCompraId: Number(ordenCompraId),
      tipoComprobanteId: Number(tipoComprobanteId),
      fecha,
      hora: undefined,
      letra: letra || null,
      numeroSucursal: numeroSucursal || null,
      numero: numero || null,
      tipoMovimientoId: Number(tipoMovimientoId),
      moneda: moneda || null,
      observaciones: observaciones || null,
      detalles: items.map(i => ({
        // ajusta al schema que espera tu backend; aquí usamos productId/quantity/unitPrice
        productId: Number(i.productId),
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        discount: i.discount ?? 0,
        observations: i.observations ?? "",
      }))
    };

    try {
      const res = await fetch("/api/comprobantes-proveedor/nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.ok) {
        alert("Comprobante creado correctamente");
        onOpenChange(false);
      } else {
        alert("Error: " + (json.error ?? "Desconocido"));
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  }
  

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-effect p-0 overflow-hidden w-full max-w-3xl md:max-w-5xl h-[75vh]">
        <div className="flex-none p-6 rounded-t-2xl bg-gradient-to-r from-primary-pink to-light-pink">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Registrar Nuevo Comprobante de Proveedor
            </AlertDialogTitle>
            <button onClick={() => onOpenChange(false)} className="text-white hover:bg-white/20 p-2 rounded-lg" aria-label="Cerrar modal">✕</button>
          </div>
        </div>

        <div className="flex-auto overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select label="Orden de Compra *" value={ordenCompraId} onChange={(e) => setOrdenCompraId(e.target.value)} className="input-focus">
              <option value="">Seleccionar Orden de Compra</option>
                {uniqueOrdenes.map((o: any, idx: number) => (
                  // key única usando id + idx (o id + nro si lo tenés)
                  <option key={`${toId(o.id)}-${idx}`} value={toId(o.id)}>
                    {formatOCLabel(o)}
                  </option>
                ))}
            </Select>

            <Select label="Proveedor *" value={proveedorId} disabled className="input-focus">
              <option value="">
                {ordenCompraId
                  ? (ordenCompra.find((o:any) => toId(o.id) === toId(ordenCompraId))?.supplier?.name
                      ?? ordenCompra.find((o:any) => toId(o.id) === toId(ordenCompraId))?.proveedor?.nombre
                      ?? proveedores.find(p => toId(p.id) === toId(proveedorId))?.name
                      ?? "Proveedor (desde OC)")
                  : "Seleccionar Orden de Compra primero"}
              </option>
            </Select>

            <Select label="Depósito" value={depositoId} disabled className="input-focus">
              <option value="">
                {ordenCompraId
                  ? (ordenCompra.find((o:any) => toId(o.id) === toId(ordenCompraId))?.deposito?.nombre
                      ?? depositos.find(d => toId(d.id) === toId(depositoId))?.name
                      ?? "Depósito (desde OC)")
                  : "Seleccionar Orden de Compra primero"}
              </option>
            </Select>

            <Input label="Fecha de Entrega *" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input-focus" />

            <Select label="Tipo Comprobante *" value={tipoComprobanteId} onChange={e => setTipoComprobanteId(e.target.value)} className="input-focus">
              <option value="">Seleccionar</option>
              {tipoComprobantesLocal.map(tc => <option key={tc.id} value={tc.id}>{tc.name}</option>)}
            </Select>

            <Select label="Metodo Pago *" value={metodoPagoId} onChange={e => setMetodoPagoId(e.target.value)} className="input-focus">
              <option value="">Seleccionar</option>
              {metodoPagosLocal.map(mp => <option key={mp.id} value={mp.id}>{mp.name}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Input label="Letra" value={letra} maxLength={1} onChange={e => setLetra(e.target.value)} className="input-focus" />
            <Input label="Número Sucursal" maxLength={4} value={numeroSucursal} onChange={e => setNumeroSucursal(e.target.value)} className="input-focus" />
            <Input label="Número" maxLength={8} value={numero} onChange={e => setNumero(e.target.value)} className="input-focus" />
            <Input label="Moneda" value={moneda} onChange={e => setMoneda(e.target.value)} className="input-focus" />
            <Input label="Observaciones" value={observaciones} onChange={e => setObservaciones(e.target.value)} className="input-focus" />
            <Input type="hidden" name="tipoMovimientoId" value={String(tipoMovimientoId)} />
          </div>

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
                      <th className="px-4 py-3 text-left text-sm font-bold text-blue-800">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td className="px-4 py-3 font-medium text-gray-900">{it.productName}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <Input type="number" min={1} value={it.quantity} onChange={(e) => updateItem(it.id, "quantity", e.target.value)} className="input-focus w-20" />
                        </td>
                        <td className="px-4 py-3 text-gray-700">${money(it.unitPrice)}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">${money(it.totalPrice)}</td>
                        <td className="px-4 py-3">
                          <Input value={it.observations} onChange={(e) => updateItem(it.id, "observations", e.target.value)} className="input-focus" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Cantidad Total: {totalCantidad}</div>
                  <div className="text-2xl font-bold text-blue-800">Total: ${money(totalMonto)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button variant="primary" className="btn-primary" disabled={!proveedorId || !depositoId || !fecha || items.length === 0} onClick={createComprobante}>Registrar Comprobante de Proveedor</Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
