// src/app/compras/page.tsx
import ComprasClient from "./ComprasClient";
import { productsMock, suppliersMock, depositosMocks} from "@/mocks/compras.mock"
import { getPurchaseOrders } from "@/server/compras/compras.service";

// Si más adelante querés consumir una API real, podés hacer fetch desde aquí (server component)
export default async function Page() {
  const initialOrders = await getPurchaseOrders({ limit: 100, sort: "desc" });

  // Mock directo (en real: await fetch + cache/revalidate)
  const proveedores = suppliersMock;
  const productos = productsMock;

  return (
    <div className="p-2">
      <ComprasClient
        initialOrders={initialOrders}
        proveedores={proveedores}
        depositos={depositosMocks}
        productos={productos}
      />
    </div>
  );
}
