import ComprasClient from "./comprobanteClient";
import { listComprobanteAction } from "./actions/comprobante";
import type {
  ComprobanteProveedor,
  Supplier,
  Deposito,
  Product,
  TipoComprobante,
  MetodoPago,
  TipoMovimiento,
  PurchaseOrder,
} from "@/lib/comprobante-proveedor/comprobante";

// Si más adelante querés reemplazar los datos auxiliares por tablas reales:
import { productsMock, purchaseOrdersMock } from "@/mocks/comprobante.mock";

export default async function Page() {
  let initialComprobantes: ComprobanteProveedor[] = [];

  try {
    initialComprobantes = await listComprobanteAction();
  } catch (err) {
    console.error("Error listando comprobantes:", err);
  }

  // Datos auxiliares (estos sí podés reemplazarlos por la BDD real si las tenés)
  const proveedores: Supplier[] = initialComprobantes.map(c => c.proveedor);
  const depositos: Deposito[] = initialComprobantes.map(c => c.deposito);
  const productos: Product[] = productsMock; // o fetch real
  const tipoComprobantes: TipoComprobante[] = initialComprobantes.map(c => c.tipoComprobante);
  const metodosPagos: MetodoPago[] = initialComprobantes.map(c => c.metodoPagoId).filter(Boolean) as MetodoPago[];
  const tiposMovimiento: TipoMovimiento[] = initialComprobantes.map(c => c.tipoMovimiento);
  const ordenCompra: PurchaseOrder[] = initialComprobantes.map(c => c.ordenCompra);

  return (
    <div className="p-2">
      <ComprasClient
        initialComprobantes={initialComprobantes}
        proveedores={proveedores}
        depositos={depositos}
        productos={productos}
        tiposComprobante={tipoComprobantes}
        tiposMovimiento={tiposMovimiento}
        metodosPagos={metodosPagos}
        ordenCompra={ordenCompra}
      />
    </div>
  );
}
