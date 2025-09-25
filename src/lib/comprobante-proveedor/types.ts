import { z } from "zod";

/* ------------ Listado ------------ */
export type ComprobanteListParams = {
  page?: number; limit?: number;
  proveedorId?: number;
  fecha_desde?: string; fecha_hasta?: string;
  numero?: string; // "A-0001-00001234" o parcial
  search?: string;
  sort?: "fecha" | "-fecha" | "total" | "-total" | "pendiente" | "-pendiente" | "pagado" | "-pagado" | "proveedor" | "-proveedor";
  depositoId?: number;
  estado?: boolean;
};

export type ComprobanteListItem = {
  id: number;
  nro_comprobante: string | null;
  proveedor: { id: number; name: string };
  tipo_comprobante: string | null;
  ordenCompra: { id: number } | null;
  deposito: { id: number; name: string } | null;
  total: number;
  pagado: number;
  pendiente: number; // alias de saldo
  saldo: number;
  fecha: string | null; // "YYYY-MM-DD"
  estado: boolean;
};

export type ComprobanteListResponse = {
  meta: { total: number; page: number; limit: number; pages: number };
  items: ComprobanteListItem[];
};

/* ------------ Prefill (GET /nuevo) ------------ */
export const ComprobanteInitQuerySchema = z.object({
  ordenCompraId: z.coerce.number().int().positive(),
});
export type ComprobanteInitQuery = z.infer<typeof ComprobanteInitQuerySchema>;

export const ComprobanteInitResponseSchema = z.object({
  oc: z.object({
    id: z.number(),
    nro: z.string().nullable().optional(),
    fecha: z.string(),
    proveedor: z.object({ id: z.number(), nombre: z.string() }),
    deposito: z.object({ id: z.number(), nombre: z.string() }).nullable(),
    items: z.array(z.object({
      productoId: z.number(),
      producto: z.string().nullable(),
      unidad: z.string().nullable(),
      cantidad: z.number(),
      precioUnitario: z.number(),
    })),
  }),
  opciones: z.object({
    tiposComprobante: z.array(z.object({ id: z.number(), nombre: z.string() })),
    metodosPago: z.array(z.object({ id: z.number(), nombre: z.string() })),
  }),
});
export type ComprobanteInitResponse = z.infer<typeof ComprobanteInitResponseSchema>;

/* ------------ Alta (POST /nuevo) ------------ */
export const ComprobanteDetalleCreateSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive(),
  precioUnitario: z.coerce.number().positive(),
  descuento: z.coerce.number().min(0).max(100).optional(),
  observaciones: z.string().optional().nullable(),
});
export type ComprobanteDetalleCreateDTO = z.infer<typeof ComprobanteDetalleCreateSchema>;

export const ComprobanteCreateSchema = z.object({
  ordenCompraId: z.coerce.number().int().positive(),
  proveedorId: z.coerce.number().int().positive().optional(), // se toma de la OC si no viene
  depositoId: z.coerce.number().int().positive().optional(),  // se toma de la OC si no viene
  tipoComprobanteId: z.coerce.number().int().positive(),
  tipoMovimientoId: z.coerce.number().int().positive().optional().nullable(),
  metodoPagoId: z.coerce.number().int().positive().optional().nullable(),
  fecha: z.string().refine(v => !Number.isNaN(Date.parse(v)), "fecha inválida (ISO)"),
  hora: z.string().optional().nullable(),
  letra: z.string().optional().nullable(),
  numeroSucursal: z.string().optional().nullable(),
  numero: z.string().optional().nullable(),
  moneda: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
  detalles: z.array(ComprobanteDetalleCreateSchema).min(1),
});
export type ComprobanteCreateDTO = z.infer<typeof ComprobanteCreateSchema>;

export const ComprobanteCreatedSchema = z.object({
  comprobante: z.object({
    id: z.number(),
    ordenCompraId: z.number(),
    proveedorId: z.number(),
    depositoId: z.number().nullable().optional(),
    tipoComprobanteId: z.number(),
    fecha: z.string(),
    hora: z.string().nullable().optional(),
    letra: z.string().nullable().optional(),
    numeroSucursal: z.string().nullable().optional(),
    numero: z.string().nullable().optional(),
    total: z.number().nullable().optional(),
    saldo: z.number().nullable().optional(),
    metodoPagoId: z.number().nullable().optional(),
    estado: z.boolean().optional(),
    observaciones: z.string().nullable().optional(),
    tipoMovimientoId: z.number().nullable().optional(),
    detalleComprobante: z.array(z.object({
      productoId: z.number(),
      cantidad: z.number(),
    })).optional(),
  }),
  movimiento: z.object({
    id: z.number(),
    depositoId: z.number(),
    tipoMovimientoId: z.number(),
    tipoComprobanteId: z.number(),
    numeroComprobante: z.string().nullable().optional(),
    fecha: z.string(),
    hora: z.string(),
    Comentario: z.string().nullable().optional(),
    tipoMovimiento: z.object({ id: z.number(), nombre: z.string(), saldo: z.boolean() }).optional(),
    tipoComprobante: z.object({ id: z.number(), nombre: z.string() }).optional(),
    deposito: z.object({ id: z.number(), nombre: z.string() }).optional(),
    detalles: z.array(z.object({
      id: z.number(),
      cantidad: z.number(),
      producto: z.object({ id: z.number(), nombre: z.string() }).optional(),
    })).optional(),
  }).optional(),
});
export type ComprobanteCreated = z.infer<typeof ComprobanteCreatedSchema>;