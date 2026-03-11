import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET: lista de proveedores activos */
export async function GET() {
  try {
    const proveedores = await prisma.proveedores.findMany({
      where: { estado: true },
      select: {
        id: true,
        nombre: true,
        razonSocial: true,
        nombreComercial: true,
        _count: {
          select: {
            comprobantes: {
              where: {
                estado: true,
                saldo: { gt: 0 }
              }
            }
          }
        }
      },
      orderBy: { nombre: "asc" }
    });

    return NextResponse.json({
      ok: true,
      data: proveedores.map(p => ({
        id: p.id,
        nombre: p.nombre,
        razonSocial: p.razonSocial,
        nombreComercial: p.nombreComercial,
        comprobantes_pendientes: p._count.comprobantes
      }))
    });
  } catch (err) {
    console.error("GET /api/ordenes-pago/proveedores", err);
    return NextResponse.json(
      { ok: false, error: "Error al obtener proveedores" },
      { status: 500 }
    );
  }
}