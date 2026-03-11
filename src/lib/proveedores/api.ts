// lib/proveedores/api.ts
import { httpJSON, toQuery } from "@/lib/utils";
import { z } from "zod";
import { IdSchema } from "@/lib/types";

export const ProveedorSchema = z.object({ id: IdSchema, nombre: z.string() });
export type ProveedorDTO = z.infer<typeof ProveedorSchema>;

export async function apiProveedores(search?: string) {
  const qs = toQuery({ search });
  return httpJSON(`/api/catalogos/proveedores${qs}`, { method: "GET" }, z.array(ProveedorSchema));
}
