import { z } from 'zod';

export const createUserSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  telefono: z.string().optional().nullable(),
  rolId: z.number().int().positive(),
  activo: z.boolean().optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .partial()
  .extend({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  });

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;