// src/app/compras/page.tsx
import ComprasClient from "./ComprasClient";
import { productsMock, purchaseOrdersMock, suppliersMock, depositosMocks} from "@/mocks/compras.mock"

// Si más adelante querés consumir una API real, podés hacer fetch desde aquí (server component)
export default async function Page() {
  // Mock directo (en real: await fetch + cache/revalidate)
  const initialOrders = purchaseOrdersMock;
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
