"use server";

import { revalidatePath } from "next/cache";
import type {
  ComprobanteProveedor,
  DetalleComprobanteProveedor,
  Supplier,
  Deposito,
  TipoMovimiento,
  PurchaseOrder,
} from "@/lib/comprobante-proveedor/comprobante";
import type { ComprobanteListItem, ComprobanteListResponse } from "@/lib/comprobante-proveedor/types";

const FALLBACK_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  ?? process.env.NEXT_BASE_URL
  ?? "http://localhost:3000";

function buildUrl(path: string): string {
  try {
    return new URL(path, FALLBACK_BASE_URL).toString();
  } catch (err) {
    console.error("[comprobante actions] URL inválida", path, err);
    throw err;
  }
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : buildUrl(path);
  const res = await fetch(url, { cache: "no-store", ...init });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch ${url} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

function mapListItemToComprobante(item: ComprobanteListItem): ComprobanteProveedor {
  const numeroFmt = item.nro_comprobante ?? `CP-${item.id}`;
  const proveedor: Supplier = {
    id: String(item.proveedor?.id ?? ""),
    name: item.proveedor?.name ?? "Proveedor",
  };

  const deposito: Deposito = item.deposito
    ? { id: String(item.deposito.id), name: item.deposito.name }
    : { id: "", name: "Sin depósito" };

  const ordenCompra: PurchaseOrder = {
    id: item.ordenCompra ? String(item.ordenCompra.id) : "-",
    supplier: proveedor,
    deposito,
    status: Boolean(item.estado),
    items: [],
  };

  const tipoMovimiento: TipoMovimiento = {
    id: item.pendiente > 0 ? "pendiente" : "cancelado",
    name: item.pendiente > 0 ? "Pendiente" : "Cancelado",
    saldo: item.pendiente > 0,
  };

  return {
    id: numeroFmt,
    ordenCompra,
    proveedor,
    deposito,
    letra: null,
    numeroSucursal: null,
    numero: numeroFmt,
    moneda: null,
    tipoComprobante: {
      id: item.tipo_comprobante ? String(item.tipo_comprobante) : "",
      name: item.tipo_comprobante ?? "Sin tipo",
    },
    fecha: item.fecha ?? "",
    hora: null,
    total: item.total ?? 0,
    saldo: item.saldo ?? item.pendiente ?? 0,
    metodoPagoId: undefined,
    estado: Boolean(item.estado),
    observaciones: null,
    tipoMovimiento,
    items: [],
  };
}

// ===== Listar comprobantes con relaciones =====
export async function listComprobanteAction(): Promise<ComprobanteProveedor[]> {
  const data = await fetchJson<ComprobanteListResponse>(
    "/api/comprobantes-proveedor"
  );
  return data.items.map(mapListItemToComprobante);
}

type ProveedoresApiResponse = {
  ok?: boolean;
  data?: Array<{
    id: number | string;
    nombreCompleto?: string | null;
    nombreFantasia?: string | null;
    razonSocial?: string | null;
    codigo?: string | null;
  }>;
};

export async function listProveedoresAction(): Promise<Supplier[]> {
  const json = await fetchJson<ProveedoresApiResponse>(
    "/api/proveedores?status=active&limit=100"
  );

  const entries = Array.isArray(json.data) ? json.data : [];
  const unique = new Map<string, Supplier>();

  for (const prov of entries) {
    const id = String(prov.id);
    const name =
      prov.nombreFantasia?.trim() ||
      prov.razonSocial?.trim() ||
      prov.nombreCompleto?.trim() ||
      prov.codigo?.trim() ||
      `Proveedor ${id}`;

    if (!unique.has(id)) {
      unique.set(id, { id, name });
    }
  }

  return Array.from(unique.values());
}

type DepositoApiResponse = {
  ok?: boolean;
  data?: Array<{ id: number | string; nombre?: string | null }>;
};

export async function listDepositosAction(): Promise<Deposito[]> {
  const json = await fetchJson<DepositoApiResponse>("/api/deposito?estado=Activo");
  const rows = Array.isArray(json.data) ? json.data : [];
  const map = new Map<string, Deposito>();

  for (const dep of rows) {
    const id = String(dep.id);
    const name = dep.nombre?.trim() || `Depósito ${id}`;
    if (!map.has(id)) {
      map.set(id, { id, name });
    }
  }

  return Array.from(map.values());
}

type TipoMovimientoApiResponse = {
  ok?: boolean;
  data?: Array<{ id: number | string; nombre: string; saldo: boolean }>;
};

export async function listTiposMovimientoAction(): Promise<TipoMovimiento[]> {
  const json = await fetchJson<TipoMovimientoApiResponse>("/api/tipos-movimientos");
  const rows = Array.isArray(json.data) ? json.data : [];
  return rows.map((tm) => ({ id: String(tm.id), name: tm.nombre, saldo: Boolean(tm.saldo) }));
}

export type OrdenCompraApiItem = {
  id: number | string;
  proveedorId?: number | string | null;
  proveedor?: string | null;
  depositoId?: number | string | null;
  estado?: boolean | null;
  total?: number | null;
};

type OrdenCompraApiResponse = {
  data?: OrdenCompraApiItem[];
};

export async function listOrdenesCompraAction(): Promise<OrdenCompraApiItem[]> {
  const json = await fetchJson<OrdenCompraApiResponse>(
    "/api/ordenes-compra?estado=true&limit=100"
  );
  return Array.isArray(json.data) ? json.data : [];
}

// ===== Crear comprobante =====
export async function createComprobanteAction(payload: {
  proveedorId: string;
  depositoId?: string;
  fecha: string;
  letra?: string;
  numeroSucursal?: string;
  numero?: string;
  moneda?: string;
  tipoComprobanteId: string;
  metodoPagoId?: string;
  items: DetalleComprobanteProveedor[];
  observaciones?: string;
}): Promise<ComprobanteProveedor> {
  const res = await fetch(buildUrl("/api/comprobantes-proveedor"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`No se pudo crear el comprobante: ${text}`);
  }

  const newComprobante = await res.json();
  revalidatePath("/comprobante-proveedor"); // refresca server component
  return newComprobante;
}
