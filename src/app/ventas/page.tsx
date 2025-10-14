// src/app/ventas/page.tsx
import { getInitialVentasData } from "@/server/ventas.service";
import VentasClient from "./VentasClient";

export const dynamic = "force-dynamic";

export default async function VentasPage() {
  const { orders, warehouses } = await getInitialVentasData();
  return (
      <VentasClient initialOrders={orders} initialWarehouses={warehouses} />
  );
}
