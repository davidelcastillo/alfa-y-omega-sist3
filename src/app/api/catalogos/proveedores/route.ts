import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();

  const rows = await prisma.proveedores.findMany({
    where: {
      estado: true,
      ...(search ? { nombre: { contains: search, mode: "insensitive" } } : {}),
    },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
    take: 50,
  });

  return NextResponse.json(rows);
}
