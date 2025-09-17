import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.tipoMovimiento.findMany({
      select: { id: true, nombre: true, saldo: true },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json({ ok: true, data: rows });
  } catch (e: any) {
    console.error("GET /api/tipos-movimiento", e);
    return NextResponse.json(
      { ok: false, error: "Error al listar tipos de movimiento" },
      { status: 500 }
    );
  }
}
