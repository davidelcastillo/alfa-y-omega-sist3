"use server";

import { revalidatePath } from "next/cache";
import type { ComprobanteProveedor, DetalleComprobanteProveedor } from "@/lib/comprobante-proveedor/comprobante";
import { getBaseUrl } from "@/lib/http";
import { normalizeComprobante } from "@/lib/comprobante-proveedor/normalizers";

// ===== Listar comprobantes con relaciones =====
export async function listComprobanteAction(): Promise<ComprobanteProveedor[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/comprobantes-proveedor?limit=50`, {
    cache: "no-store",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.error ?? "No se pudo listar comprobantes");

  return Array.isArray(result?.items) ? result.items.map(normalizeComprobante) : [];
}

// ===== Crear comprobante =====
type CreatePayload = {
  ordenCompraId: string;
  proveedorId: string;
  depositoId?: string;
  fecha: string;
  tipoComprobanteId: string;
  metodoPagoId?: string;
  tipoMovimientoId?: string;
  letra?: string | null;
  numeroSucursal?: string | null;
  numero?: string | null;
  moneda?: string | null;
  observaciones?: string | null;
  items: DetalleComprobanteProveedor[];
};

export async function createComprobanteAction(payload: CreatePayload): Promise<void> {
  const baseUrl = getBaseUrl();
  const body = {
    ordenCompraId: Number(payload.ordenCompraId),
    proveedorId: Number(payload.proveedorId),
    depositoId: payload.depositoId ? Number(payload.depositoId) : undefined,
    tipoComprobanteId: Number(payload.tipoComprobanteId),
    metodoPagoId: payload.metodoPagoId ? Number(payload.metodoPagoId) : undefined,
    tipoMovimientoId: payload.tipoMovimientoId ? Number(payload.tipoMovimientoId) : undefined,
    fecha: payload.fecha,
    letra: payload.letra ?? null,
    numeroSucursal: payload.numeroSucursal ?? null,
    numero: payload.numero ?? null,
    moneda: payload.moneda ?? null,
    observaciones: payload.observaciones ?? null,
    detalles: payload.items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discount: item.discount ?? 0,
      observations: item.observations ?? "",
    })),
  };

  const res = await fetch(`${baseUrl}/api/comprobantes-proveedor/nuevo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error ?? "No se pudo crear el comprobante");
  }

  revalidatePath("/comprobante-proveedor");
}
