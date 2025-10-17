import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const productosVendidos = await prisma.detallePedido.groupBy({
            by: ["productoId"],
            _sum: {
                cantidad: true,
            },
            orderBy: {
                _sum: {
                    cantidad: "desc",
                },
            },
            take: 5, // Top 5 productos
        });

        const productosIds = productosVendidos.map((p) => p.productoId);
        const productos = await prisma.producto.findMany({
            where: {
                id: {
                    in: productosIds,
                },
            },
            select: {
                id: true,
                nombre: true,
            },
        });

        const productosMap = new Map(productos.map((p) => [p.id, p.nombre]));

        const resultado = productosVendidos.map((p) => ({
            productoId: p.productoId,
            nombre: productosMap.get(p.productoId) || "Desconocido",
            cantidadVendida: p._sum.cantidad || 0,
        }));

        return NextResponse.json({ ok: true, data: resultado });
    } catch (err: any) {
        console.error("[GET /api/dashboard/productos-mas-vendidos]", err);
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Error en productos más vendidos" },
            { status: 500 }
        );
    }
}