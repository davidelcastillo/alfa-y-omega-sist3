// src/app/ventas/[id]/detalles/page.tsx
import { notFound } from "next/navigation";
import VentasDetalles from "@/components/ventas/VentasDetalles";
import type { Order } from "@/lib/ventas/types";

// ⛳️ Ajustá este import si tu mock vive en otro lado
import { ordersMock } from "@/mocks/ventas.mock";

// Shape que consume el componente (simple y directo)
export type VentaDetail = {
  id: string;
  orderNumber: string;
  registrationDate: string; // "YYYY-MM-DD HH:mm:ss"
  orderDate: string;        // "YYYY-MM-DD"
  orderTime: string;        // "HH:mm"
  customerName: string;
  cardNumber: string;
  status: "Enviado" | "Pendiente de enviar";
  shippedDate?: string;
  warehouse?: string;
  total: number;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  history: { date: string; action: string; user: string }[];
};

// Mapea Order (mock) -> VentaDetail (UI)
function mapOrderToVentaDetail(o: Order): VentaDetail {
  // Derivados básicos
  const dateOnly = o.orderDate; // ya viene en formato "YYYY-MM-DD" según tu lista
  const registrationDate = `${o.orderDate} ${o.orderTime}:00`; // "YYYY-MM-DD HH:mm:ss"

  return {
    id: String(o.id),
    orderNumber: o.orderNumber,
    registrationDate,
    orderDate: dateOnly,
    orderTime: o.orderTime,
    customerName: o.customerName,
    cardNumber: o.cardNumber,
    status: o.status,
    shippedDate: o.shippedDate,
    warehouse: o.warehouse,
    total: o.total,
    products: o.products.map(p => ({
      id: String(p.id),
      name: p.name,
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      subtotal: p.subtotal,
    })),
    history: o.history ?? [],
  };
}

export default async function VentaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15: params es Promise
  // Tus ids de Order pueden ser string/number; buscamos de ambas formas
  const order = (ordersMock as Order[]).find(
    (x) => String(x.id) === String(id)
  );

  if (!order) notFound();

  const venta = mapOrderToVentaDetail(order);

  return (
    <div className="p-6">
      <VentasDetalles venta={venta} />
    </div>
  );
}
