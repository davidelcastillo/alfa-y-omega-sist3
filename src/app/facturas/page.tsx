// src/app/facturas/page.tsx
import { getInitialFacturasData } from "@/server/facturas/service"; // <-- MODIFICADO
import FacturasClient from "./FacturasClient"; // <-- MODIFICADO

export const dynamic = "force-dynamic";

export default async function FacturasPage() { // <-- MODIFICADO
  const { facturas, depositos } = await getInitialFacturasData(); // <-- MODIFICADO
  return (
      <FacturasClient initialFacturas={facturas} initialDepositos={depositos} /> // <-- MODIFICADO
  );
}