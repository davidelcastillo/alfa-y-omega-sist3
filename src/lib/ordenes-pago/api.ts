import { z } from "zod";
import { OrdenPagoDetailSchema, type OrdenPagoDetail } from "./types";
import {
  OrdenPagoCreateSchema,
  type OrdenPagoCreateDTO,
  OrdenPagoInitQuerySchema,
  OrdenPagoInitResponseSchema,
  type OrdenPagoListParams,
  type OrdenPagoListResponse,
  OrdenPagoCreatedSchema,
} from "./types";

/** Rutas (por si cambian luego) */
export const OP_ROUTES = {
  init:   "/api/ordenes-pago/nueva",
  create: "/api/ordenes-pago/nueva",
  list:   "/api/ordenes-pago",
  detail: (id: number) => `/api/ordenes-pago/${id}/detalle`,
};

/** GET /api/ordenes-pago/nueva?proveedorId=ID  -> prefill */
export async function apiGetOrdenPagoInit(params: { proveedorId: number }) {
  const q = OrdenPagoInitQuerySchema.parse(params);
  const res = await fetch(`${OP_ROUTES.init}?proveedorId=${q.proveedorId}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || json?.ok === false)
    throw new Error(json?.error || "Error init OP");
  return z
    .object({ ok: z.boolean(), data: OrdenPagoInitResponseSchema })
    .parse(json).data;
}

/** POST /api/ordenes-pago/nueva  -> crear */
export async function apiCreateOrdenPago(payload: OrdenPagoCreateDTO) {
  const body = OrdenPagoCreateSchema.parse(payload);
  const res = await fetch(OP_ROUTES.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json?.ok === false)
    throw new Error(json?.error || "Error creando OP");
  return z.object({ ok: z.boolean(), data: OrdenPagoCreatedSchema }).parse(json)
    .data;
}

/** GET /api/ordenes-pago  -> listado */
export async function apiListOrdenesPago(
  params: OrdenPagoListParams = {}
): Promise<OrdenPagoListResponse> {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) sp.set(k, String(v));
  });
  const res = await fetch(`${OP_ROUTES.list}?${sp.toString()}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Error listando OP");
  return json as OrdenPagoListResponse;
}

/** GET detalle */
export async function apiGetOrdenPagoDetail(id: number): Promise<OrdenPagoDetail> {
  const res = await fetch(OP_ROUTES.detail(id), { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || json?.ok === false) throw new Error(json?.error || "Error obteniendo detalle de OP");
  return z.object({ ok: z.boolean(), data: OrdenPagoDetailSchema }).parse(json).data;
}
