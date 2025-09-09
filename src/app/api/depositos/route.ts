import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const depositos = await prisma.deposito.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(depositos); // 👈 ¡Devolvemos el array directamente!
  } catch (error) {
    console.error("Error al obtener los depósitos:", error);
    return NextResponse.json({ error: "Error al obtener los depósitos" }, { status: 500 });
  }
}
