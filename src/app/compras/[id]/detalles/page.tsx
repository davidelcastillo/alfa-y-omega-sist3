// src/app/compras/[id]/detalles/page.tsx
import { notFound } from "next/navigation";
import DetallesCompras from "@/components/compras/ComprasDetalles";
import { getOrdenCompraDetalleUI } from "@/server/ordenes-compra.service";

export default async function Page({ params }: { params: { id: string } }) {
  const order = await getOrdenCompraDetalleUI(Number(params.id));
  if (!order) return notFound();

  return (
    <main className="p-6 md:p-8 space-y-6">
      <DetallesCompras order={order} />
    </main>
  );
}
