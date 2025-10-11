// src/app/api/ordenes-compra/[id]/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validación de un ítem con Zod
const ItemSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().positive(),
});

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }   // 👈 params ahora es Promise
) {
  try {
    // 👇 se resuelve con await
    const { id } = await context.params;
    const ordenCompraId = Number(id);

    if (!Number.isFinite(ordenCompraId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const dto = ItemSchema.parse(body);

    const data = await prisma.$transaction(async (tx) => {
      const oc = await tx.ordenCompra.findUnique({
        where: { id: ordenCompraId },
        select: { id: true, otrosGastos: true },
      });
      if (!oc) throw new Error("Orden de compra inexistente");

      await tx.detalleOrdenCompra.create({
        data: { ordenCompraId, ...dto },
      });

      const items = await tx.detalleOrdenCompra.findMany({
        where: { ordenCompraId },
        select: { cantidad: true, precioUnitario: true },
      });

      const subTotal = items.reduce(
        (acc, it) => acc + Number(it.cantidad) * Number(it.precioUnitario),
        0
      );
      const total = subTotal + Number(oc.otrosGastos ?? 0);

      const updated = await tx.ordenCompra.update({
        where: { id: ordenCompraId },
        data: { subTotal, total },
        select: { id: true, subTotal: true, total: true },
      });

      return updated;
    });

    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message ?? "Error" }, { status: 400 });
  }
}
