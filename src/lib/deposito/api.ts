// lib/deposito/api.ts
import { httpJSON } from "@/lib/utils";
import { z } from "zod";
import { IdSchema } from "@/lib/types";

export const DepositoSchema = z.object({ id: IdSchema, nombre: z.string() });
export type DepositoDTO = z.infer<typeof DepositoSchema>;

export async function apiDepositos() {
  return httpJSON("/api/catalogos/depositos", { method: "GET" }, z.array(DepositoSchema));
}
