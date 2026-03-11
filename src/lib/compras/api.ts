// lib/compras/api.ts
import { httpJSON, toQuery } from "@/lib/utils";
import {
  OrdenCompraQuery,
  OrdenCompraQuerySchema,
  OrdenCompraCreateDTO,
  OrdenCompraCreateSchema,
  OrdenCompraItemDTO,
  OrdenCompraItemSchema,
  OrdenCompraPatchDTO,
  OrdenCompraPatchSchema,
  OCListResponseSchema,
  OCDetailedResponseSchema,
} from "./types";

export async function apiOCList(params: Partial<OrdenCompraQuery> = {}) {
  const parsed = OrdenCompraQuerySchema.parse(params);
  const qs = toQuery(parsed);
  return httpJSON(`/api/ordenes-compra${qs}`, { method: "GET" }, OCListResponseSchema);
}

export async function apiOCGet(id: number) {
  return httpJSON(`/api/ordenes-compra/${id}/detalle`, { method: "GET" }, OCDetailedResponseSchema);
}

export async function apiOCCreate(dto: OrdenCompraCreateDTO): Promise<OrdenCompraCreateResponse> {
  const body = JSON.stringify(OrdenCompraCreateSchema.parse(dto));
  return httpJSON(`/api/ordenes-compra`, { method: "POST", body });
}

export async function apiOCAddItem(ocId: number, dto: OrdenCompraItemDTO) {
  const body = JSON.stringify(OrdenCompraItemSchema.parse(dto));
  return httpJSON(`/api/ordenes-compra/${ocId}/items`, { method: "POST", body });
}

export async function apiOCPatch(ocId: number, dto: OrdenCompraPatchDTO) {
  const body = JSON.stringify(OrdenCompraPatchSchema.parse(dto));
  return httpJSON(`/api/ordenes-compra/${ocId}`, { method: "PATCH", body });
}

export type OrdenCompraCreateResponse = {
  id: number;
  proveedorId: number;
  depositoId: number | null;
  fecha: string;
  fechaEntrega: string | null;
  total: number;
  subTotal: number;
  estado: boolean;
};
