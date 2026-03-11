// src/app/facturas/[id]/detalles/page.tsx
import { notFound } from "next/navigation";
// Asumo que crearás este componente basado en VentasDetalles
import FacturasDetalles from "@/components/facturas/FacturasDetalles"; // <-- MODIFICADO
import { getFacturaDetail } from "@/server/facturas/service"; // <-- MODIFICADO
import type { FacturaDetail } from "@/lib/facturas/types"; // <-- MODIFICADO

export const dynamic = "force-dynamic";

export default async function FacturaDetallePage({ // <-- MODIFICADO
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = (await params) as { id: string };

  const factura: FacturaDetail | null = await getFacturaDetail(id); // <-- MODIFICADO
  if (!factura) notFound();

  return (
    <div className="p-6">
      <FacturasDetalles factura={factura} /> {/* <-- MODIFICADO */}
    </div>
  );
}