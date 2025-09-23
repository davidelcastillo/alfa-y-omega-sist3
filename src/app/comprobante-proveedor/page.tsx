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
import { getBaseUrl } from "@/lib/http";
import {
  normalizeDeposito,
  normalizePurchaseOrder,
  normalizeSupplier,
  normalizeTipoMovimiento,
} from "@/lib/comprobante-proveedor/normalizers";

export default async function Page() {
  let initialComprobantes: ComprobanteProveedor[] = [];
  const baseUrl = getBaseUrl();

  try {
    initialComprobantes = await listComprobanteAction();
  } catch (err) {
    console.error("Error listando comprobantes:", err);
  }

  async function safeFetch(path: string) {
    try {
      const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `Error al obtener ${path}`);
      return json;
    } catch (err) {
      console.error(`Error consultando ${path}`, err);
      return null;
    }
  }

  const [proveedoresRes, depositosRes, ordenesRes, tiposMovimientoRes] = await Promise.all([
    safeFetch("/api/proveedores?status=all"),
    safeFetch("/api/deposito?estado=Activo"),
    safeFetch("/api/ordenes-compra?limit=50"),
    safeFetch("/api/tipos-movimientos"),
  ]);

  const proveedoresMap = new Map<string, Supplier>();
  if (Array.isArray(proveedoresRes?.data)) {
    for (const row of proveedoresRes.data) {
      const supplier = normalizeSupplier(row);
      if (supplier.id) proveedoresMap.set(supplier.id, supplier);
    }
  }
  for (const c of initialComprobantes) {
    if (c.proveedor?.id) proveedoresMap.set(c.proveedor.id, c.proveedor);
  }
  const proveedores = Array.from(proveedoresMap.values());

  const depositosMap = new Map<string, Deposito>();
  if (Array.isArray(depositosRes?.data)) {
    for (const row of depositosRes.data) {
      const dep = normalizeDeposito(row);
      if (dep.id) depositosMap.set(dep.id, dep);
    }
  }
  for (const c of initialComprobantes) {
    if (c.deposito?.id) depositosMap.set(c.deposito.id, c.deposito);
  }
  const depositos = Array.from(depositosMap.values());

  const ordenCompraMap = new Map<string, PurchaseOrder>();
  if (Array.isArray(ordenesRes?.data)) {
    for (const row of ordenesRes.data) {
      const oc = normalizePurchaseOrder(row);
      if (oc.id) ordenCompraMap.set(oc.id, oc);
    }
  }
  for (const c of initialComprobantes) {
    if (c.ordenCompra?.id) ordenCompraMap.set(c.ordenCompra.id, c.ordenCompra);
  }
  const ordenCompra = Array.from(ordenCompraMap.values());

  const tiposMovimientoSet = new Map<string, TipoMovimiento>();
  if (Array.isArray(tiposMovimientoRes?.data)) {
    for (const row of tiposMovimientoRes.data) {
      const tm = normalizeTipoMovimiento(row);
      if (tm.id) tiposMovimientoSet.set(tm.id, tm);
    }
  }
  for (const c of initialComprobantes) {
    if (c.tipoMovimiento?.id) tiposMovimientoSet.set(c.tipoMovimiento.id, c.tipoMovimiento);
  }
  const tiposMovimiento = Array.from(tiposMovimientoSet.values());

  const tiposComprobanteMap = new Map<string, TipoComprobante>();
  for (const c of initialComprobantes) {
    if (c.tipoComprobante?.id) tiposComprobanteMap.set(c.tipoComprobante.id, c.tipoComprobante);
  }
  const tipoComprobantes = Array.from(tiposComprobanteMap.values());

  const metodosPagoMap = new Map<string, MetodoPago>();
  for (const c of initialComprobantes) {
    if (c.metodoPago?.id) metodosPagoMap.set(c.metodoPago.id, c.metodoPago);
  }
  const metodosPagos = Array.from(metodosPagoMap.values());

  const productos: Product[] = [];

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
