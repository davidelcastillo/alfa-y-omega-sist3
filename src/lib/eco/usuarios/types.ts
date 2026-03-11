import { z } from "zod";

// roles vienen de la tabla Rol (ej: "CLIENTE", "ADMIN")
export const RoleName = z.string().min(1);
export type RoleName = z.infer<typeof RoleName>;

export const LoginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
});
export type LoginBody = z.infer<typeof LoginBodySchema>;

export const AddressSchema = z.object({
    calle: z.string().min(2, "Calle requerida"),
    numero: z.string().min(1, "Número requerido"),
    pisoDepto: z.string().optional().nullable(),
    codigoPostal: z.string().min(3, "CP requerido"),
    ciudad: z.string().min(2, "Ciudad requerida"),
    provincia: z.string().min(2, "Provincia requerida"),
    pais: z.string().min(2, "País requerido"),
});

/** Body del registro de usuario */
export const DireccionSchema = z.object({
    calle: z.string().min(1),
    numero: z.string().min(1),
    pisoDepto: z.string().optional().nullable(),
    codigoPostal: z.string().min(1),
    ciudad: z.string().min(1),
    provincia: z.string().min(1),
    pais: z.string().min(1),
    placeId: z.string().optional().nullable(),
});

export const RegisterBodySchema = z.object({
    nombre: z.string().min(2),
    apellido: z.string().min(2),
    email: z.string().email(),
    telefono: z
        .string()
        .trim()
        .transform((v) => v.replace(/[^\d+]/g, "")) // normalizar
        .refine((v) => /^\+?\d{8,15}$/.test(v), "Teléfono inválido"),
    password: z
        .string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[a-z]/, "Debe incluir minúsculas")
        .regex(/[A-Z]/, "Debe incluir mayúsculas")
        .regex(/\d/, "Debe incluir números")
        .regex(/[^A-Za-z0-9]/, "Debe incluir símbolos"),
    direccion: DireccionSchema,
});
export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export const UserPublicSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    nombre: z.string(),
    apellido: z.string(),
    roles: z.array(RoleName),
});

export const LoginSuccessSchema = z.object({
    message: z.string().optional(),
    user: UserPublicSchema,
    token: z.string(),
});
export type LoginSuccess = z.infer<typeof LoginSuccessSchema>;

export const ErrorSchema = z.object({ error: z.string() });
export type ErrorResponse = z.infer<typeof ErrorSchema>;

export const LoginResponseSchema = z.union([LoginSuccessSchema, ErrorSchema]);
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Payload que guardamos en el JWT
export type JwtUser = {
    sub: string;        // id Usuario
    email: string;
    nombre: string;
    apellido: string;
    roles: string[];    // nombres de Rol
};
