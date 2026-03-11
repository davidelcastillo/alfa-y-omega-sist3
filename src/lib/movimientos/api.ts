// lib/movimientos/api.ts
import { httpJSON, toQuery } from "@/lib/utils";
import { z } from "zod";
import { IdSchema } from "@/lib/types";

export const ProductoLiteSchema = z.object({
  id: IdSchema,
  nombre: z.string(),
  rubro: z.string().nullable().optional(),
  marca: z.string().nullable().optional(),
  unidad: z.string().nullable().optional(),
});
export type ProductoLiteDTO = z.infer<typeof ProductoLiteSchema>;

export async function apiProductosLite(params?: { search?: string; limit?: number }) {
  const qs = toQuery(params || {});
  return httpJSON(
    `/api/catalogos/productos${qs}`,
    { method: "GET" },
    z.array(ProductoLiteSchema)
  );
}
