import ComprasClient from "./comprobanteClient";
import {
  listComprobanteAction,
  listProveedoresAction,
  listDepositosAction,
  listTiposMovimientoAction,
  listOrdenesCompraAction,
  type OrdenCompraApiItem,
} from "./actions/comprobante";
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

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = String(item.id);
    if (!map.has(key)) map.set(key, item);
  }
  return Array.from(map.values());
}

function mapOrdenesCompra(
  raw: OrdenCompraApiItem[],
  proveedores: Supplier[],
  depositos: Deposito[],
): PurchaseOrder[] {
  const proveedorMap = new Map(proveedores.map((p) => [String(p.id), p]));
  const depositoMap = new Map(depositos.map((d) => [String(d.id), d]));

  return raw.map((oc) => {
    const proveedorId = oc.proveedorId != null ? String(oc.proveedorId) : "";
    const depositoId = oc.depositoId != null ? String(oc.depositoId) : "";

    const supplier = proveedorMap.get(proveedorId) ?? {
      id: proveedorId,
      name: oc.proveedor ?? (proveedorId ? `Proveedor ${proveedorId}` : "Proveedor"),
    };

    const deposito = depositoMap.get(depositoId) ?? {
      id: depositoId,
      name: depositoId ? `Depósito ${depositoId}` : "Sin depósito",
    };

    return {
      id: String(oc.id),
      supplier,
      deposito,
      status: Boolean(oc.estado),
      items: [],
    } satisfies PurchaseOrder;
  });
}

export default async function Page() {
  const [
    comprobantesResult,
    proveedoresResult,
    depositosResult,
    tiposMovimientoResult,
    ordenesCompraResult,
  ] = await Promise.allSettled([
    listComprobanteAction(),
    listProveedoresAction(),
    listDepositosAction(),
    listTiposMovimientoAction(),
    listOrdenesCompraAction(),
  ]);

  const initialComprobantes: ComprobanteProveedor[] =
    comprobantesResult.status === "fulfilled" ? comprobantesResult.value : [];

  if (comprobantesResult.status === "rejected") {
    console.error("Error listando comprobantes:", comprobantesResult.reason);
  }

  const proveedoresApi =
    proveedoresResult.status === "fulfilled" ? proveedoresResult.value : [];
  if (proveedoresResult.status === "rejected") {
    console.error("Error listando proveedores:", proveedoresResult.reason);
  }

  const depositosApi =
    depositosResult.status === "fulfilled" ? depositosResult.value : [];
  if (depositosResult.status === "rejected") {
    console.error("Error listando depósitos:", depositosResult.reason);
  }

  const tiposMovimientoApi =
    tiposMovimientoResult.status === "fulfilled" ? tiposMovimientoResult.value : [];
  if (tiposMovimientoResult.status === "rejected") {
    console.error("Error listando tipos de movimiento:", tiposMovimientoResult.reason);
  }

  const ordenesCompraApi =
    ordenesCompraResult.status === "fulfilled" ? ordenesCompraResult.value : [];
  if (ordenesCompraResult.status === "rejected") {
    console.error("Error listando órdenes de compra:", ordenesCompraResult.reason);
  }

  const proveedores = dedupeById([
    ...initialComprobantes.map((c) => c.proveedor),
    ...proveedoresApi,
  ]);

  const depositos = dedupeById([
    ...initialComprobantes.map((c) => c.deposito),
    ...depositosApi,
  ]);

  const tiposMovimiento = tiposMovimientoApi.length
    ? tiposMovimientoApi
    : dedupeById(initialComprobantes.map((c) => c.tipoMovimiento));

  const ordenCompra = dedupeById([
    ...initialComprobantes.map((c) => c.ordenCompra),
    ...mapOrdenesCompra(ordenesCompraApi, proveedores, depositos),
  ]);

  const productos: Product[] = [];
  const tipoComprobantes: TipoComprobante[] = dedupeById(
    initialComprobantes.map((c) => c.tipoComprobante)
  );
  const metodosPagos: MetodoPago[] = dedupeById(
    initialComprobantes
      .map((c) => c.metodoPagoId)
      .filter((m): m is MetodoPago => Boolean(m))
  );

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
