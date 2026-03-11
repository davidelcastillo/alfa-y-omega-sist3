// src/lib/ordenes-pago/api.ts
import { z } from "zod";
import {
  OrdenPagoCreateSchema,
  type OrdenPagoCreateDTO,
  OrdenPagoInitQuerySchema,
  OrdenPagoInitResponseSchema,
  type OrdenPagoListParams,
  type OrdenPagoListResponse,
  OrdenPagoCreatedSchema,
  OrdenPagoDetailSchema,
  type OrdenPagoDetail,
} from "./types";

export const OP_ROUTES = {
  init:   "/api/ordenes-pago/nueva",
  create: "/api/ordenes-pago/nueva",
  list:   "/api/ordenes-pago",
  detail: (id: number) => `/api/ordenes-pago/${id}/detalle`,
} as const;

/* ============== helpers ============== */
function toQuery(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

async function getBaseUrl() {
  // En cliente: URL relativa funciona perfecto
  if (typeof window !== "undefined") return "";

  // En servidor (RSC / Server Actions)
  try {
    const { headers } = await import("next/headers");
    const h = await headers(); // Next 15: debe esperarse
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) return `${proto}://${host}`;
  } catch {
    // ignore
  }
  // Fallbacks
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any)?.error || `HTTP ${res.status} ${url}`);
  return json as T;
}

/* ============== endpoints ============== */
export async function apiGetOrdenPagoInit(params: { proveedorId: number }) {
  const q = OrdenPagoInitQuerySchema.parse(params);
  const base = await getBaseUrl();
  const url = `${base}${OP_ROUTES.init}${toQuery({ proveedorId: q.proveedorId })}`;

  const json = await fetchJson<{ ok: boolean; data: unknown }>(url);
  if (json.ok === false) throw new Error("Error init OP");
  return z.object({ ok: z.literal(true), data: OrdenPagoInitResponseSchema }).parse(json).data;
}

export async function apiCreateOrdenPago(payload: OrdenPagoCreateDTO) {
  const body = OrdenPagoCreateSchema.parse(payload);
  const base = await getBaseUrl();
  const url = `${base}${OP_ROUTES.create}`;

  const json = await fetchJson<{ ok: boolean; data: unknown }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (json.ok === false) throw new Error("Error creando OP");
  return z.object({ ok: z.literal(true), data: OrdenPagoCreatedSchema }).parse(json).data;
}

export async function apiListOrdenesPago(
  params: OrdenPagoListParams = {}
): Promise<OrdenPagoListResponse> {
  const base = await getBaseUrl();
  const url = `${base}${OP_ROUTES.list}${toQuery(params)}`;
  return await fetchJson<OrdenPagoListResponse>(url);
}

export async function apiGetOrdenPagoDetail(id: number): Promise<OrdenPagoDetail> {
  const base = await getBaseUrl();
  const url = `${base}${OP_ROUTES.detail(id)}`;

  const json = await fetchJson<{ ok: boolean; data: unknown }>(url);
  if (json.ok === false) throw new Error("Error obteniendo detalle de OP");
  return z.object({ ok: z.literal(true), data: OrdenPagoDetailSchema }).parse(json).data;
}
