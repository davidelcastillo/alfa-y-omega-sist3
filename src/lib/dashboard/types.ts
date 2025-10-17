import { z } from "zod";

export const GranularidadSchema = z.enum(["dia", "mes"]);
export type Granularidad = z.infer<typeof GranularidadSchema>;

export const DashboardResumenQuerySchema = z.object({
    desde: z.string(),  // ISO date (YYYY-MM-DD)
    hasta: z.string(),
    gran: GranularidadSchema,
});
export type DashboardResumenQuery = z.infer<typeof DashboardResumenQuerySchema>;

export const DashboardPuntoSchema = z.object({
    periodo: z.string(),           // "YYYY-MM" o "YYYY-MM-DD"
    ingresos: z.number(),
    egresos: z.number(),
    resultado: z.number(),
});
export type DashboardPunto = z.infer<typeof DashboardPuntoSchema>;

export const DashboardResumenSchema = z.object({
    desde: z.string(),
    hasta: z.string(),
    gran: GranularidadSchema,
    totales: z.object({
        ingresos: z.number(),
        egresos: z.number(),
        resultado: z.number(),
    }),
    series: z.array(DashboardPuntoSchema),
});
export type DashboardResumen = z.infer<typeof DashboardResumenSchema>;
