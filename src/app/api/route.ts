import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1) ping directo a Postgres
    const now = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`;

    // 2) algunos conteos (darán 0 si no hay datos, igual sirve)
    const [rubros, unidades, marcas, productos, depositos] = await Promise.all([
      prisma.rubro.count(),
      prisma.unidad.count(),
      prisma.marca.count(),
      prisma.producto.count(),
      prisma.deposito.count(),
    ]);

    return NextResponse.json({
      ok: true,
      dbTime: now[0]?.now, // si ves una fecha aquí, ¡estás conectado!
      counts: { rubros, unidades, marcas, productos, depositos },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

