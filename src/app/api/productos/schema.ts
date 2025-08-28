import { z } from 'zod';
//se instalo zod para validaciones y tipos seguros de datos realiza validaciones y crea tipos seguros de datos
// Schema para crear un producto
export const createProductoSchema = z.object({
    nombre: z.string().min(1),
    descripcion: z.string().optional(),
    rubroId: z.number().int().positive(),
    marcaId: z.number().int().positive(),
    unidadId: z.number().int().positive(),
    precioCompra: z.number().nonnegative(),
    precioVenta: z.number().nonnegative(),
    estado: z.boolean().optional(), // default true si no viene
});

export type CreateProductoDTO = z.infer<typeof createProductoSchema>;
