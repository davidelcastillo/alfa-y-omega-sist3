import { z } from "zod";

const tipos = ["Principal", "Sucursal", "Temporal", "Tránsito"] as const;

export const createDepositoSchema = z.object({
  nombre: z.string().trim().min(2).max(80),
  ubicacion: z.string().trim().min(2).max(120),
  // Normaliza "Transito" -> "Tránsito" y luego valida contra el enum
  tipo: z.string().transform((s) => (s === "Transito" ? "Tránsito" : s)).pipe(z.enum(tipos)),
  capacidad: z.union([z.number().int().nonnegative(), z.null()]).optional(),
  estado: z.boolean().optional().default(true),
});

export type CreateDepositoInput = z.infer<typeof createDepositoSchema>;
