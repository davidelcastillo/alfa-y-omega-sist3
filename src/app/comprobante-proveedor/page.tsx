// src/app/comprobante-proveedor/page.tsx
import ComprasClient from "./comprobanteClient";
import { comprobanteProveedorMock,
          suppliersMock,
          depositosMock,
          tipoComprobantesMock,
          metodoPagosMock,
          tipoMovimientosMock,
          productsMock,
          purchaseOrdersMock} from "@/mocks/comprobante.mock"

// Si más adelante querés consumir una API real, podés hacer fetch desde aquí (server component)
export default async function Page() {
  // Mock directo (en real: await fetch + cache/revalidate)
  const initialComprobantes = comprobanteProveedorMock;
  const proveedores = suppliersMock;
  const productos = productsMock;
  const ordenesCompra = purchaseOrdersMock;
  const depositos = depositosMock;
    const tipoComprobantes = tipoComprobantesMock;
    const metodoPagos = metodoPagosMock;
    const tipoMovimientos = tipoMovimientosMock;

  return (
    <div className="p-2">
      <ComprasClient
        initialComprobantes={[initialComprobantes]}
        proveedores={proveedores}
        depositos={depositosMock}
        productos={productos}
        tiposComprobante={tipoComprobantes}
        tiposMovimiento={tipoMovimientos}
        metodosPagos={metodoPagos}
        ordenCompra={ordenesCompra}
      />
    </div>
  );
}
