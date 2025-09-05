import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDepositoSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createDepositoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validación fallida", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { nombre, ubicacion, tipo, capacidad, estado = true } = parsed.data;

    // Evitar duplicados por nombre (case-insensitive)
    const duplicado = await prisma.deposito.findFirst({
      where: { nombre: { equals: nombre, mode: "insensitive" } },
      select: { id: true },
    });
    if (duplicado) {
      return NextResponse.json(
        { error: "Ya existe un depósito con ese nombre." },
        { status: 409 }
      );
    }

    const created = await prisma.deposito.create({
      data: {
        nombre,
        ubicacion,
        tipo,                    // "Tránsito" ya normalizado si venía "Transito"
        capacidad: capacidad ?? null,
        estado: estado ?? true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    // Si más adelante agregás @unique(nombre) y la DB lo detecta:
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Nombre duplicado." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
