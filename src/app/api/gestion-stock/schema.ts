import { z } from "zod";

export const gestionStockQuerySchema = z.object({
  depositId: z.coerce.number().int().positive().optional(), // si viene lo uso, si no es "todos"
  status: z.enum(["all", "ok", "belowMin", "atZero", "overMax"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(["stock", "nombre", "stockMinimo", "stockMaximo", "updatedAt"]).default("nombre"),
  dir: z.enum(["asc", "desc"]).default("asc"),
  q: z.string().trim().optional(),
});

export type GestionStockQuery = z.infer<typeof gestionStockQuerySchema>;
