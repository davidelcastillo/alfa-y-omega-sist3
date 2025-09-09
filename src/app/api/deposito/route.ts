import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const tipo = searchParams.get("tipo") || ""
  const estado = searchParams.get("estado") || ""

  const deps = await prisma.deposito.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { nombre: { contains: search, mode: "insensitive" } },
                { ubicacion: { contains: search, mode: "insensitive" } },
                { tipo: { contains: search, mode: "insensitive" } },
                //{ capacidad: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        tipo ? { tipo } : {},
        estado
          ? { estado: estado === "Activo" }
          : {},
      ],
    },
    orderBy: { id: "desc" },
    take: 50,
  });
  
  return NextResponse.json({ ok: true, data: deps });
}