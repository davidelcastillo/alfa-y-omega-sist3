import { z } from "zod";
import {
  ComprobanteInitQuerySchema, ComprobanteInitResponseSchema,
  ComprobanteCreateSchema, type ComprobanteCreateDTO, ComprobanteCreatedSchema,
  type ComprobanteListParams, type ComprobanteListResponse,
} from "./types";

export const CP_ROUTES = {
  list:   "/api/comprobantes-proveedor",
  init:   (ordenCompraId: number) => `/api/comprobantes-proveedor/nuevo?ordenCompraId=${ordenCompraId}`,
  create: "/api/comprobantes-proveedor/nuevo",
};

/** GET listado */
export async function apiListComprobantes(params: ComprobanteListParams = {}): Promise<ComprobanteListResponse> {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null) sp.set(k, String(v)); });
  const res = await fetch(`${CP_ROUTES.list}?${sp.toString()}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Error al listar comprobantes");
  return json as ComprobanteListResponse;
}

/** GET prefill de alta (trae OC, proveedor/deposito y opciones) */
export async function apiGetComprobanteInit(args: { ordenCompraId: number }) {
  const q = ComprobanteInitQuerySchema.parse(args);
  const res = await fetch(CP_ROUTES.init(q.ordenCompraId), { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || json?.ok === false) throw new Error(json?.error || "Error preparando alta de comprobante");
  return z.object({ ok: z.boolean(), data: ComprobanteInitResponseSchema }).parse(json).data;
}

/** POST alta de comprobante (crea movimiento también) */
export async function apiCreateComprobante(payload: ComprobanteCreateDTO) {
  const body = ComprobanteCreateSchema.parse(payload);
  const res = await fetch(CP_ROUTES.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json?.ok === false) throw new Error(json?.error || "Error creando comprobante");
  return z.object({ ok: z.boolean(), data: ComprobanteCreatedSchema }).parse(json).data;
}
