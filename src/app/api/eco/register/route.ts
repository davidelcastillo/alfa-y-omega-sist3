import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RegisterBodySchema } from "@/lib/eco/usuarios/types";
import { hashPassword } from "@/lib/eco/usuarios/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nombre, apellido, email, password } = RegisterBodySchema.parse(body);

        // email único
        const exists = await prisma.usuario.findUnique({ where: { email }, select: { id: true } });
        if (exists) {
            return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 });
        }

        // asegurar rol CLIENTE
        let rol = await prisma.rol.findUnique({ where: { nombre: "CLIENTE" } });
        if (!rol) {
            rol = await prisma.rol.create({ data: { nombre: "CLIENTE" } });
        }

        // crear usuario
        const passwordHash = await hashPassword(password);
        const user = await prisma.usuario.create({
            data: {
                email,
                nombre,
                apellido,
                passwordHash,
                activo: true,
                roles: {
                    create: [{ rolId: rol.id }], // UsuarioRol
                },
            },
            select: { id: true, email: true, nombre: true, apellido: true },
        });

        return NextResponse.json({ message: "Registro OK", user }, { status: 201 });
    } catch (err: any) {
        console.error("[REGISTER]", err);
        return NextResponse.json({ error: "Error en registro" }, { status: 400 });
    }
}
