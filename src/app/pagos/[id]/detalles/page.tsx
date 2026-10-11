// src/app/pagos/[id]/detalles/page.tsx
import { notFound } from "next/navigation";
import PagoDetail from "@/components/pagos/PagoDetail";
import { apiGetOrdenPagoDetail } from "@/lib/ordenes-pago/api";
import {
  formatFechaOrdenPago,
  mapOrdenPagoDetailToSupplierPayment,
} from "@/lib/ordenes-pago/mappers";
import type { OrdenPagoDetail } from "@/lib/ordenes-pago/types";
import type { SupplierPayment } from "@/mocks/pagos.mock";

// Mapeo DTO -> shape del componente
function mapDetailToSupplierPayment(d: OrdenPagoDetail): SupplierPayment {
  const { dateOnly } = formatFechaOrdenPago(d.fecha);

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
    ...mapOrdenPagoDetailToSupplierPayment(d),
    products,
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
