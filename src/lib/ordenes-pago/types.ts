// src/lib/ordenes-pago/types.ts
import { z } from "zod";

/* ---------- Líneas / detalles ---------- */
export const OrdenPagoDetalleSchema = z.object({
  comprobanteId: z.coerce.number().int().positive(),
  montoPagado: z.coerce.number().positive(), // > 0
});
export type OrdenPagoDetalleDTO = z.infer<typeof OrdenPagoDetalleSchema>;

/* ---------- Crear OP ---------- */
export const OrdenPagoCreateSchema = z.object({
  proveedorId: z.coerce.number().int().positive(),
  fecha: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "fecha inválida (ISO)"),
  metodoPagoId: z.coerce.number().int().positive(),
  nroInterno: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
  detalles: z
    .array(OrdenPagoDetalleSchema)
    .min(1, "Debe incluir al menos un detalle"),
});
export type OrdenPagoCreateDTO = z.infer<typeof OrdenPagoCreateSchema>;

/* ---------- Prefill (GET /nueva) ---------- */
export const OrdenPagoInitQuerySchema = z.object({
  proveedorId: z.coerce.number().int().positive(),
});
export type OrdenPagoInitQuery = z.infer<typeof OrdenPagoInitQuerySchema>;

export const OrdenPagoInitResponseSchema = z.object({
  proveedor: z.object({ id: z.number(), nombre: z.string() }),
  metodosPago: z.array(z.object({ id: z.number(), nombre: z.string() })),
  comprobantesPendientes: z.array(
    z.object({
      id: z.number(),
      fecha: z.string(),
      letra: z.string().nullable(),
      numeroSucursal: z.string().nullable(),
      numero: z.string().nullable(),
      total: z.number().nullable(),
      saldo: z.number().nullable(),
    })
  ),
});
export type OrdenPagoInitResponse = z.infer<typeof OrdenPagoInitResponseSchema>;

/* ---------- Listado (GET /ordenes-pago) ---------- */
export type OrdenPagoListParams = {
  page?: number;
  limit?: number;
  proveedorId?: number;
  metodoPagoId?: number;
  estado?: boolean; // activa/anulada
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
  sort?:
  | "fecha"
  | "-fecha"
  | "total"
  | "-total"
  | "proveedor"
  | "-proveedor"
  | "metodoPago"
  | "-metodoPago"
  | "estado"
  | "-estado";
};

export type OrdenPagoListItem = {
  id: number;
  fecha: string;
  nro_interno: string | null;
  proveedor: { id: number; nombre: string };
  metodo_pago: { id: number; nombre: string } | null;
  estado: boolean;
  estado_pago: "anulada" | "sin_detalle" | "completo" | "parcial";
  total_pagado: number;
  comprobantes_afectados: number;
  saldo_restante_total: number;
};

export type OrdenPagoListResponse = {
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    totales: { total_pagado: number };
  };
  items: OrdenPagoListItem[];
};

/* ---------- Respuesta al crear ---------- */
export const OrdenPagoCreatedSchema = z.object({
  ordenPago: z.object({
    id: z.number(),
    proveedorId: z.number(),
    fecha: z.string(),
    nroInterno: z.string().nullable(),
    metodoPagoId: z.number(),
    totalPagado: z.number(),
  }),
  detalles: z.array(
    z.object({
      comprobanteId: z.number(),
      montoPagado: z.number(),
      saldoPrevio: z.number().nullable(),
      saldoRestante: z.number().nullable(),
    })
  ),
});
export type OrdenPagoCreated = z.infer<typeof OrdenPagoCreatedSchema>;

/* ---------- detalle de OP ---------- */
export const ProveedorFullSchema = z.object({
  id: z.number(),
  razonSocial: z.string().nullable().optional(),
  nombre: z.string(),
  nombreComercial: z.string().nullable().optional(),
  codigo: z.string().nullable().optional(),
  genero: z.string().nullable().optional(),
  categoriaFiscalId: z.number().nullable().optional(),
  cuil: z.string().nullable().optional(),
  pais: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  localidad: z.string().nullable().optional(),
  barrio: z.string().nullable().optional(),
  codigoPostal: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  paginaWeb: z.string().nullable().optional(),
  correoElectronico: z.string().nullable().optional(),
  estado: z.boolean(),
  items: z.array(z.object({
    id: z.number(),
    nombre: z.string(),
    cantidad: z.number(),
    precioUnitario: z.number(),
  })).optional(),

});

export const OrdenPagoDetailSchema = z.object({
  id: z.number(),
  fecha: z.string(),
  nro_interno: z.string().nullable(),
  observaciones: z.string().nullable().optional(),
  estado: z.boolean(),
  metodo_pago: z.object({ id: z.number(), nombre: z.string() }).nullable(),
  proveedor: ProveedorFullSchema,
  totales: z.object({
    total_pagado: z.number(),
    comprobantes: z.number(),
    saldo_restante_total: z.number(),
  }),
  detalles: z.array(z.object({
    aplicado: z.object({
      montoPagado: z.number(),
      saldoPrevio: z.number(),
      saldoRestante: z.number(),
    }),
    comprobante: z.object({
      id: z.number(),
      fecha: z.string(),
      tipoComprobante: z.object({ id: z.number(), nombre: z.string() }),
      letra: z.string().nullable(),
      numeroSucursal: z.string().nullable(),
      numero: z.string().nullable(),
      nro_formateado: z.string().nullable(),
      total: z.number(),
      saldoActual: z.number(),
      estado: z.boolean(),
      deposito: z.object({ id: z.number(), nombre: z.string() }).nullable(),
      proveedor: z.object({ id: z.number(), nombre: z.string() }),
      moneda: z.string().nullable(),
    }),
  })),
});

export type OrdenPagoDetail = z.infer<typeof OrdenPagoDetailSchema>;