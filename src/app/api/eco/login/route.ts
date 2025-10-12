// src/app/api/eco/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signJwt } from "@/lib/eco/usuarios/auth";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = LoginSchema.parse(body);

        const user = await prisma.usuario.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                passwordHash: true,
                nombre: true,
                apellido: true,
                roles: {               // UsuarioRol[]
                    select: {
                        rol: { select: { nombre: true } } // Rol.nombre
                    }
                }
            },
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        // Tomamos el primer rol disponible (ajustá a tu lógica)
        const role = (user.roles[0]?.rol?.nombre ?? "").toUpperCase();

        // Firmo JWT con nombre y apellido
        const token = signJwt({
            sub: String(user.id),
            email: user.email,
            role,
            name: user.nombre ?? "",
            lastName: user.apellido ?? "",
        });

        const res = NextResponse.json({
            message: "Login OK",
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre ?? "",
                apellido: user.apellido ?? "",
                role,
            },
            token,
        });

        res.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 8, // 8hs
        });

        return res;
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
        }
        console.error("[LOGIN]", err);
        return NextResponse.json({ error: "Error en login" }, { status: 500 });
    }
}
