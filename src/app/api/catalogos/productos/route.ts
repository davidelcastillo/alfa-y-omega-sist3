import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const limit = Number(searchParams.get("limit") || 25);

  const rows = await prisma.producto.findMany({
    where: search ? { nombre: { contains: search, mode: "insensitive" } } : {},
    select: {
      id: true,
      nombre: true,
      rubro: { select: { nombre: true } },
      marca: { select: { nombre: true } },
      unidad: { select: { nombre: true } },
    },
    orderBy: { nombre: "asc" },
    take: Math.min(Math.max(limit, 1), 100),
  });

  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      rubro: r.rubro?.nombre ?? null,
      marca: r.marca?.nombre ?? null,
      unidad: r.unidad?.nombre ?? null,
    }))
  );
}
