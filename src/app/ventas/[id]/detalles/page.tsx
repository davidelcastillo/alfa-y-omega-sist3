// src/app/ventas/[id]/detalles/page.tsx
import { notFound } from "next/navigation";
import VentasDetalles from "@/components/ventas/VentasDetalles";
import { getOrderDetail } from "@/server/ventas.service";
import type { VentaDetail } from "@/lib/ventas/types";

export const dynamic = "force-dynamic";

export default async function VentaDetallePage({
  params,
}: {
  // Si tu Next 15 entrega Promise, usá esta firma:
  params: Promise<{ id: string }>;
  // Si no, cambiá a: params: { id: string };
}) {
  const { id } = (await params) as { id: string };

  const venta: VentaDetail | null = await getOrderDetail(id);
  if (!venta) notFound();

  return (
    <div className="p-6">
      <VentasDetalles venta={venta} />
    </div>
  );
}
