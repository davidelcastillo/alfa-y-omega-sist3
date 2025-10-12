// src/app/pagos/[id]/detalles/page.tsx
import { notFound } from "next/navigation";
import PagoDetail from "@/components/pagos/PagoDetail";
import { apiGetOrdenPagoDetail } from "@/lib/ordenes-pago/api";
import type { OrdenPagoDetail } from "@/lib/ordenes-pago/types";
import type { SupplierPayment } from "@/mocks/pagos.mock";

// Mapeo DTO -> shape del componente
function mapDetailToSupplierPayment(d: OrdenPagoDetail): SupplierPayment {
  const fecha = new Date(d.fecha);
  const dateOnly = fecha.toISOString().split("T")[0];
  const registrationDate = fecha.toISOString().replace("T", " ").substring(0, 19);
  const paidComplete = d.estado && d.totales.saldo_restante_total === 0;

  const products = d.detalles.flatMap(det =>
    (det.comprobante.items ?? []).map(it => ({
      id: String(it.id),
      name: it.nombre,
      quantity: it.cantidad,
      price: it.precioUnitario,
      total: it.cantidad * it.precioUnitario,
    }))
  );

  return {
    id: String(d.id),
    paymentId: d.nro_interno || `PAG-${String(d.id).padStart(3, "0")}`,
    registrationDate,
    invoiceCode: d.nro_interno || `OP-${d.id}`,
    purchaseOrderNumber: `OC-${String(d.id).padStart(3, "0")}`,
    paymentDueDate: dateOnly,
    dueDate: dateOnly,
    supplier: {
      id: String(d.proveedor.id),
      name: d.proveedor.nombre,
      code: d.proveedor.codigo || `PROV${String(d.proveedor.id).padStart(3, "0")}`,
      email: d.proveedor.correoElectronico || undefined,
      phone: d.proveedor.telefono || undefined,
    },
    total: d.totales.total_pagado,
    payment: paidComplete ? d.totales.total_pagado : 0,
    balance: d.totales.saldo_restante_total,
    comment: `${d.totales.comprobantes} comprobante(s) afectado(s)`,
    status: paidComplete ? "Pagado" : "Pendiente de pago",
    paymentCompleteDate: paidComplete ? dateOnly : undefined,
    paymentMethod: d.metodo_pago?.nombre || "Transferencia",
    voucherType:
      d.detalles[0]?.comprobante?.tipoComprobante?.nombre?.slice(0, 3).toUpperCase() || "FAC",
    voucherNumber: d.nro_interno || `OP-${d.id}`,
    products,
    history: [
      { date: registrationDate.substring(0, 16), action: "Orden de pago registrada", user: "Sistema" },
    ],
    partialPayments: d.detalles.map((det, i) => ({
      id: String(i + 1),
      date: dateOnly,
      amount: det.aplicado.montoPagado,
      method: d.metodo_pago?.nombre || "Transferencia",
    })),
  };
}

// 👇 fíjate el tipo de props y el await de params
export default async function PagoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;           // ← hay que esperar params en Next 15
  const nid = Number(id);
  if (!Number.isFinite(nid)) notFound();

  const detail = await apiGetOrdenPagoDetail(nid);
  const pago = mapDetailToSupplierPayment(detail);

  return (
    <div className="p-6">
      <PagoDetail pago={pago as any} />
    </div>
  );
}
