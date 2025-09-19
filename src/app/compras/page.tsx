// src/app/compras/page.tsx
import ComprasClient from "./ComprasClient";
//import { productsMock, suppliersMock, depositosMocks} from "@/mocks/compras.mock"
import { getPurchaseOrders } from "@/server/compras/compras.service";
import { getSuppliersService } from "@/server/proveedores/proveedores.service";
import { getDepositosService } from "@/server/deposito/depositos.service"; // devuelve objetos

//import { getDepositosNamesService } from "@/server/deposito/depositos.service";

// Si más adelante querés consumir una API real, podés hacer fetch desde aquí (server component)
export default async function Page() {
  //const initialOrders = await getPurchaseOrders({ limit: 100, sort: "desc" });
  const [initialOrders, proveedores, depositosRows] = await Promise.all([
    getPurchaseOrders({ limit: 100, sort: "desc" }),
    getSuppliersService({ status: "active", limit: 100 }), // ajustá según tu listarProveedores
    getDepositosService({ /*estado: "Activo"*/ }),
  ]);

  // Mock directo (en real: await fetch + cache/revalidate)
  //const proveedores = suppliersMock;
  //const productos = productsMock;

  //const ComprasClient = (await import("./ComprasClient")).default;
  //const depositos = depositosRows.map(d => d.name); // ["Depósito Central", "Depósito Norte", ...]
  //const depositosRows = await getDepositosService({ /* estado: "Activo" */ });
  const depositos = depositosRows.map(d => ({ id: d.id, name: d.name }));
  const productos: any[] = []; // cuando tengas endpoint de productos, hacemos el mismo patrón

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
