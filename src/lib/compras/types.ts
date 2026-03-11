// lib/compras/types.ts
import { z } from "zod";
import { IdSchema, ISODateString } from "@/lib/types";

// Query lista OC
export const OrdenCompraQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(200).default(10),
  estado: z.boolean().optional(),
  proveedorId: IdSchema.optional(),
  depositoId: IdSchema.optional(),
  fecha_desde: ISODateString.optional(),
  fecha_hasta: ISODateString.optional(),
  search: z.string().trim().min(1).optional(),
  sort: z.enum(["asc", "desc"]).default("desc"),
});
export type OrdenCompraQuery = z.infer<typeof OrdenCompraQuerySchema>;

// Crear OC (encabezado)
export const OrdenCompraCreateSchema = z.object({
  fecha: ISODateString,
  hora: z.string().optional(),
  nroOC: z.string().optional(),
  proveedorId: IdSchema,
  subTotal: z.number().nonnegative().optional(),
  otrosGastos: z.number().nonnegative().optional(),
  total: z.number().nonnegative().optional(),
  fechaEntrega: ISODateString.optional(),
  depositoId: IdSchema.optional(),
  observaciones: z.string().optional(),
});
export type OrdenCompraCreateDTO = z.infer<typeof OrdenCompraCreateSchema>;

// Item OC
export const OrdenCompraItemSchema = z.object({
  productoId: IdSchema,
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().positive(),
});
export type OrdenCompraItemDTO = z.infer<typeof OrdenCompraItemSchema>;

// PATCH encabezado
export const OrdenCompraPatchSchema = z.object({
  estado: z.boolean().optional(),
  observaciones: z.string().nullable().optional(),
  fechaEntrega: ISODateString.nullable().optional(),
  depositoId: IdSchema.nullable().optional(),
});
export type OrdenCompraPatchDTO = z.infer<typeof OrdenCompraPatchSchema>;

// Respuestas tipadas mínimas
export const OCListRowSchema = z.object({
  id: IdSchema,
  fecha: z.string(),
  hora: z.string().nullable().optional(),
  nroOC: z.string().nullable().optional(),
  proveedor: z.object({ id: IdSchema, nombre: z.string() }),
  depositoId: IdSchema.nullable().optional(),
  subTotal: z.number().nullable().optional(),
  otrosGastos: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
  estado: z.boolean(),
  _count: z.object({ detalleOrdenCompra: z.number() }),
});
export type OCListRow = z.infer<typeof OCListRowSchema>;

export const OCListResponseSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
  data: z.array(OCListRowSchema),
});
export type OCListResponse = z.infer<typeof OCListResponseSchema>;

export const OCDetailedItemSchema = z.object({
  productoId: IdSchema,
  producto: z.string().nullable(),
  rubro: z.string().nullable(),
  marca: z.string().nullable(),
  unidad: z.string().nullable(),
  cantidad: z.number(),
  precioUnitario: z.number(),
  totalLinea: z.number(),
});

export const OCDetailedResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    id: IdSchema,
    fecha: z.string(),
    hora: z.string().nullable().optional(),
    proveedor: z.object({ id: IdSchema, nombre: z.string() }),
    deposito: z.object({ id: IdSchema, nombre: z.string() }).nullable().optional(),
    fechaEntrega: z.string().nullable().optional(),
    estado: z.boolean(),
    observaciones: z.string().nullable().optional(),
    totales: z.object({
      items: z.number(),
      subTotal_db: z.number(),
      subTotal_calc: z.number(),
      otrosGastos: z.number(),
      total_db: z.number(),
      total_calc: z.number(),
    }),
    items: z.array(OCDetailedItemSchema),
  }),
});
export type OCDetailedResponse = z.infer<typeof OCDetailedResponseSchema>;
