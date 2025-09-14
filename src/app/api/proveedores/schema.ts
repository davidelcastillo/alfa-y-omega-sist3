import { z } from 'zod';

export const createProveedorSchema = z.object({
  // Obligatorios
  nombre: z.string().min(2, 'Nombre requerido'),
  categoriaFiscalId: z.number().int().positive(), 
  // Opcionales (se guardan como null si no vienen)
  razonSocial: z.string().trim().optional().nullable(),
  nombreComercial: z.string().trim().optional().nullable(),
  codigo: z.string().trim().optional().nullable(),
  genero: z.string().trim().optional().nullable(),
  

  // La API recibe "cuit", pero en BD el campo se llama "cuil"
  cuil: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform(v => (v ? v.replace(/\D/g, '') : v))        // solo dígitos
    .refine(v => !v || v.length === 11, 'CUIT debe tener 11 dígitos'),

  pais: z.string().trim().optional().nullable(),
  provincia: z.string().trim().optional().nullable(),
  localidad: z.string().trim().optional().nullable(),
  barrio: z.string().trim().optional().nullable(),
  codigoPostal: z.string().trim().optional().nullable(),
  telefono: z.string().trim().optional().nullable(),
  paginaWeb: z.string().url().optional().nullable()
    .or(z.literal('').transform(() => null)),
  correoElectronico: z.string().email().optional().nullable()
    .or(z.literal('').transform(() => null)),
});

export type CreateProveedorDTO = z.infer<typeof createProveedorSchema>;
