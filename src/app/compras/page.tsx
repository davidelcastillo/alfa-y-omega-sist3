// src/app/compras/page.tsx
import ComprasClient from "./ComprasClient";
// 🔁 MODIFICADO: dejamos solo productsMock (si todavía no traés productos desde API)
import { productsMock /*, suppliersMock, depositosMocks */ } from "@/mocks/compras.mock"
// 🟢 AGREGADO: usamos los servicios reales para órdenes, proveedores y depósitos
import { getPurchaseOrders, getSuppliers, getDeposits } from "@/server/compras/compras.service";

// Si más adelante querés consumir una API real, podés hacer fetch desde aquí (server component)
export default async function Page() {
  // 🟢 AGREGADO: traemos todo en paralelo desde la API/servicios reales
  const [initialOrders, proveedores, depositos] = await Promise.all([
    getPurchaseOrders({ limit: 100, sort: "desc" }),
    getSuppliers(),
    getDeposits(),
  ]);

  // Mock directo (en real: await fetch + cache/revalidate)
  const productos = productsMock; // 🔁 MODIFICADO: mantenemos solo productos como mock (si querés)

  return (
    <div className="p-2">
      <ComprasClient
        initialOrders={initialOrders}
        proveedores={proveedores}   
        depositos={depositos}   
        productos={productos}
      />
    </div>
  );
}
