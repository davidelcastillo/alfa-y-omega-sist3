// src/app/api/depositos/[id]/stock/schema.ts
import { z } from 'zod';

export const stockQuerySchema = z.object({
  status: z.enum(['all', 'belowMin', 'atZero', 'overMax']).default('all'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(['stock', 'nombre', 'stockMinimo', 'stockMaximo', 'updatedAt']).default('nombre'),
  dir: z.enum(['asc', 'desc']).default('asc'),
  q: z.string().trim().optional()
});

export type StockQuery = z.infer<typeof stockQuerySchema>;
