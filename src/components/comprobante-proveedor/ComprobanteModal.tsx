"use client"

import { useMemo, useState, useEffect } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import type {
  Product,
  DetalleComprobanteProveedor,
  PurchaseOrder,
} from "@/lib/comprobante-proveedor/comprobante"

import {
  apiGetComprobanteInit,
  apiCreateComprobante,
} from "@/lib/comprobante-proveedor/api"

type SimpleOption = { id: string; name: string }

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  proveedores: { id: string; name: string }[]
  depositos: { id: string; name: string }[]
  productos: Product[]
  tipoComprobantes: SimpleOption[]
  tipoMovimientos: { id: string; name: string }[]
  metodoPagos: SimpleOption[]
  ordenCompra: PurchaseOrder[]
  initial?: {
    proveedorId?: string
    depositoId?: string
    fecha?: string
    tipoMovimientoId?: string
    tipoComprobanteId?: string
    metodoPagoId?: string
    ordenCompraId?: string
    items?: DetalleComprobanteProveedor[]
    letra?: string
    numeroSucursal?: string
    numero?: string
    moneda?: string
    observaciones?: string
  }
  onSubmit: (payload: any) => void
}

function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 })
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
  const [proveedorId, setProveedorId] = useState(initial?.proveedorId ?? "")
  const [ordenCompraId, setOrdenCompraId] = useState(initial?.ordenCompraId ?? "")
  const [depositoId, setDepositoId] = useState(initial?.depositoId ?? "")
  const [fecha, setFecha] = useState(initial?.fecha ?? "")
  const [tipoComprobanteId, setTipoComprobanteId] = useState(initial?.tipoComprobanteId ?? "")
  const [metodoPagoId, setMetodoPagoId] = useState(initial?.metodoPagoId ?? "")
  const [items, setItems] = useState<DetalleComprobanteProveedor[]>(initial?.items ?? [])

  const [letra, setLetra] = useState(initial?.letra ?? "")
  const [numeroSucursal, setNumeroSucursal] = useState(initial?.numeroSucursal ?? "")
  const [numero, setNumero] = useState(initial?.numero ?? "")
  const [moneda, setMoneda] = useState(initial?.moneda ?? "ARS")
  const [observaciones, setObservaciones] = useState(initial?.observaciones ?? "")
  const [tipoMovimientoId, setTipoMovimientoId] = useState(initial?.tipoMovimientoId ?? "1")

  const [tipoComprobantesLocal, setTipoComprobantesLocal] = useState<SimpleOption[]>(tipoComprobantes ?? [])
  const [metodoPagosLocal, setMetodoPagosLocal] = useState<SimpleOption[]>(metodoPagos ?? [])

  const totalCantidad = useMemo(() => items.reduce((s, i) => s + (i.quantity ?? 0), 0), [items])
  const totalMonto = useMemo(() => items.reduce((s, i) => s + (i.totalPrice ?? 0), 0), [items])

  // 🔹 Cargar datos desde API cuando se seleccione una OC
  useEffect(() => {
    if (!ordenCompraId) return

    let cancelled = false
    ;(async () => {
      try {
        const res = await apiGetComprobanteInit({ ordenCompraId: Number(ordenCompraId) })
        if (cancelled) return

        const oc = res.oc
        setProveedorId(String(oc.proveedor.id))
        setDepositoId(String(oc.deposito.id))

        const mappedItems = oc.items.map((it: any, idx: number) => ({
          id: String(it.productoId ?? idx),
          productId: Number(it.productoId),
          productName: it.producto,
          quantity: Number(it.cantidad),
          unitPrice: Number(it.precioUnitario),
          totalPrice: Number(it.cantidad) * Number(it.precioUnitario),
        }))
        setItems(mappedItems)

        setTipoComprobantesLocal(res.opciones.tiposComprobante.map((t) => ({ id: String(t.id), name: t.nombre })))
        setMetodoPagosLocal(res.opciones.metodosPago.map((m) => ({ id: String(m.id), name: m.nombre })))
      } catch (err) {
        console.error("Error cargando init:", err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [ordenCompraId])

  function updateItem(id: string, field: "quantity" | "observations", value: any) {
    setItems((arr) =>
      arr.map((it) =>
        it.id === id
          ? { ...it, [field]: field === "quantity" ? Number(value) : value, totalPrice: field === "quantity" ? Number(value) * it.unitPrice : it.totalPrice }
          : it
      )
    )
  }

  async function createComprobante() {
    if (!proveedorId || !depositoId || !fecha || !tipoComprobanteId || !metodoPagoId || !ordenCompraId || items.length === 0) {
      alert("Completar todos los campos obligatorios")
      return
    }

    try {
      const comprobante = await apiCreateComprobante({
        ordenCompraId: Number(ordenCompraId),
        proveedorId: Number(proveedorId),
        depositoId: Number(depositoId),
        tipoComprobanteId: Number(tipoComprobanteId),
        metodoPagoId: Number(metodoPagoId),
        tipoMovimientoId: Number(tipoMovimientoId),
        fecha,
        letra,
        numeroSucursal,
        numero,
        moneda,
        observaciones,
        detalles: items.map((i) => ({
          productoId: i.productId,
          cantidad: i.quantity,
          precioUnitario: i.unitPrice,
        })),
      })

      alert("Comprobante creado correctamente")
      onSubmit(comprobante)
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      alert("Error al crear comprobante: " + err.message)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-effect w-full max-w-5xl h-[75vh]">
        <div className="flex-none p-6 bg-gradient-to-r from-primary-pink to-light-pink">
          <AlertDialogTitle className="text-2xl font-bold text-white">
            Registrar Nuevo Comprobante de Proveedor
          </AlertDialogTitle>
        </div>

        <div className="flex-auto overflow-y-auto p-8 space-y-8">
          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select label="Orden de Compra *" value={ordenCompraId} onChange={(e) => setOrdenCompraId(e.target.value)}>
              <option value="">Seleccionar</option>
              {ordenCompra.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} - {o.proveedor?.nombre}
                </option>
              ))}
            </Select>
            <Select label="Proveedor *" value={proveedorId} disabled>
              <option>{proveedorId}</option>
            </Select>
            <Select label="Depósito *" value={depositoId} disabled>
              <option>{depositoId}</option>
            </Select>
            <Input label="Fecha *" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <Select label="Tipo Comprobante *" value={tipoComprobanteId} onChange={(e) => setTipoComprobanteId(e.target.value)}>
              <option value="">Seleccionar</option>
              {tipoComprobantesLocal.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Select label="Método Pago *" value={metodoPagoId} onChange={(e) => setMetodoPagoId(e.target.value)}>
              <option value="">Seleccionar</option>
              {metodoPagosLocal.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>

          {/* TABLA DE ITEMS */}
          {items.length > 0 && (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Producto</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Precio Unit.</th>
                  <th className="p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2">{it.productName}</td>
                    <td className="p-2">
                      <Input type="number" value={it.quantity} onChange={(e) => updateItem(it.id, "quantity", e.target.value)} />
                    </td>
                    <td className="p-2">${money(it.unitPrice)}</td>
                    <td className="p-2">${money(it.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={createComprobante}>
              Guardar
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
