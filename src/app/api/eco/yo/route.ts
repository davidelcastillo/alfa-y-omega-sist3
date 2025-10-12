// src/app/api/eco/yo/route.ts
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/eco/usuarios/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
    return NextResponse.json({ error: "Usar método POST para esta ruta" }, { status: 400 });
}

export async function POST(req: Request) {
    try {
        const cookie = (req.headers.get("cookie") ?? "")
            .split("; ")
            .find((c) => c.startsWith("auth_token="));
        const token = cookie?.split("=")[1];

        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const payload = verifyJwt<{ sub: string; email: string; role?: string; name?: string; lastName?: string }>(token);
        if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

        let nombre = payload.name ?? "";
        let apellido = payload.lastName ?? "";

        if (!nombre || !apellido) {
            // fallback DB
            const u = await prisma.usuario.findUnique({
                where: { id: Number(payload.sub) },
                select: { nombre: true, apellido: true },
            });
            nombre = u?.nombre ?? nombre;
            apellido = u?.apellido ?? apellido;
        }

        return NextResponse.json({
            id: Number(payload.sub),
            email: payload.email,
            role: payload.role ?? "",
            nombre,
            apellido,
        });
    } catch (err) {
        console.error("[YO API]", err);
        return NextResponse.json({ error: "Error al obtener datos del usuario" }, { status: 500 });
    }
}
