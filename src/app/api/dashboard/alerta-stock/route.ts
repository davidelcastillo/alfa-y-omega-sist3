import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const productosBajoStock = await prisma.stockPorDeposito.findMany({
            where: {
                stockActual: {
                    lte: prisma.stockPorDeposito.fields.stockMinimo,
                },
            },
            include: {
                producto: {
                    select: {
                        nombre: true,
                        sku: true,
                    },
                },
                deposito: {
                    select: {
                        nombre: true,
                    },
                },
            },
            orderBy: {
                producto: {
                    nombre: "asc",
                },
            },
        });

        const resultado = productosBajoStock.map(s => ({
            productoId: s.productoId,
            nombre: s.producto.nombre,
            sku: s.producto.sku,
            deposito: s.deposito.nombre,
            stockActual: s.stockActual,
            stockMinimo: s.stockMinimo,
        }));

        return NextResponse.json({ ok: true, data: resultado });
    } catch (err: any) {
        console.error("[GET /api/dashboard/alerta-stock]", err);
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Error en alerta de stock" },
            { status: 500 }
        );
    }
}