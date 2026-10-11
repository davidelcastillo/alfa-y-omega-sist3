// src/lib/ordenes-pago/mappers.ts
import { format } from "date-fns";
import { tz } from "@date-fns/tz";
import type { OrdenPagoDetail, OrdenPagoListItem } from "./types";
import type {
  PaymentMethod,
  PaymentStatus,
  SupplierLite,
  SupplierPayment,
  VoucherType,
} from "@/mocks/pagos.mock";

/** Datos del proveedor usados para armar `SupplierPayment.supplier`. */
export type ProveedorOrdenPago = {
  id: number;
  nombre: string;
  codigo?: string | null;
  correoElectronico?: string | null;
  telefono?: string | null;
};

// Las fechas se muestran en UTC: las OP cargadas con fecha "YYYY-MM-DD" se guardan a medianoche UTC.
const FECHA_TZ = tz("UTC");

export function formatFechaOrdenPago(fecha: string) {
  const d = new Date(fecha);
  return {
    registrationDate: format(d, "yyyy-MM-dd HH:mm:ss", { in: FECHA_TZ }),
    historyDate: format(d, "yyyy-MM-dd HH:mm", { in: FECHA_TZ }),
    dateOnly: format(d, "yyyy-MM-dd", { in: FECHA_TZ }),
  };
}

function mapProveedor(p: ProveedorOrdenPago): SupplierLite {
  return {
    id: String(p.id),
    name: p.nombre,
    code: p.codigo || `PROV${String(p.id).padStart(3, "0")}`,
    email: p.correoElectronico || undefined,
    phone: p.telefono || undefined,
  };
}

type OrdenPagoBase = {
  id: number;
  fecha: string;
  nro_interno: string | null;
  metodo_pago: { nombre: string } | null;
  proveedor: ProveedorOrdenPago;
  total: number;
  balance: number;
  comprobantes: number;
  status: PaymentStatus;
  paidComplete: boolean;
  voucherType: VoucherType;
};

function buildSupplierPayment(o: OrdenPagoBase): SupplierPayment {
  const { registrationDate, historyDate, dateOnly } = formatFechaOrdenPago(o.fecha);
  const paddedId = String(o.id).padStart(3, "0");

  return {
    id: String(o.id),
    paymentId: o.nro_interno || `PAG-${paddedId}`,
    registrationDate,
    invoiceCode: o.nro_interno || `OP-${o.id}`,
    purchaseOrderNumber: `OC-${paddedId}`,
    paymentDueDate: dateOnly,
    dueDate: dateOnly,
    supplier: mapProveedor(o.proveedor),
    total: o.total,
    payment: o.paidComplete ? o.total : 0,
    balance: o.balance,
    comment: `${o.comprobantes} comprobante(s) afectado(s)`,
    status: o.status,
    paymentCompleteDate: o.paidComplete ? dateOnly : undefined,
    paymentMethod: (o.metodo_pago?.nombre as PaymentMethod | undefined) || "Transferencia",
    voucherType: o.voucherType,
    voucherNumber: o.nro_interno || `OP-${o.id}`,
    products: [],
    history: [{ date: historyDate, action: "Orden de pago registrada", user: "Sistema" }],
    partialPayments: [],
  };
}

/**
 * Item del listado de órdenes de pago -> `SupplierPayment`.
 * `proveedor` aporta código/email/teléfono, que el listado no incluye.
 */
export function mapOrdenPagoToSupplierPayment(
  item: OrdenPagoListItem,
  proveedor?: ProveedorOrdenPago
): SupplierPayment {
  const paidComplete = item.estado_pago === "completo";
  let status: PaymentStatus = "Pendiente de pago";
  if (!item.estado) status = "Vencido"; // Anulada se trata como vencida para la UI
  else if (paidComplete) status = "Pagado";

  return buildSupplierPayment({
    id: item.id,
    fecha: item.fecha,
    nro_interno: item.nro_interno,
    metodo_pago: item.metodo_pago,
    proveedor: { ...proveedor, id: item.proveedor.id, nombre: item.proveedor.nombre },
    total: item.total_pagado,
    balance: item.saldo_restante_total,
    comprobantes: item.comprobantes_afectados,
    status,
    paidComplete,
    voucherType: "FAC",
  });
}

/** Detalle de una orden de pago -> `SupplierPayment` (sin productos ni pagos parciales). */
export function mapOrdenPagoDetailToSupplierPayment(d: OrdenPagoDetail): SupplierPayment {
  const paidComplete = d.estado && d.totales.saldo_restante_total === 0;

  return buildSupplierPayment({
    id: d.id,
    fecha: d.fecha,
    nro_interno: d.nro_interno,
    metodo_pago: d.metodo_pago,
    proveedor: d.proveedor,
    total: d.totales.total_pagado,
    balance: d.totales.saldo_restante_total,
    comprobantes: d.totales.comprobantes,
    status: paidComplete ? "Pagado" : "Pendiente de pago",
    paidComplete,
    voucherType: (d.detalles[0]?.comprobante?.tipoComprobante?.nombre
      ?.slice(0, 3)
      .toUpperCase() || "FAC") as VoucherType,
  });
}
