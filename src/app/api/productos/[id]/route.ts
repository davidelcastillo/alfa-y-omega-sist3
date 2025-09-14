import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { updateProductoSchema } from "../schema";  // 👈 usamos el schema de update

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Parsear body con Zod (todos los campos opcionales, pero validados)
    const body = await req.json();
    const data = updateProductoSchema.parse(body);

    // 2. Actualizar producto
    const productoActualizado = await prisma.producto.update({
      where: { id: Number(params.id) },
      data,
    });

    // 3. Respuesta consistente
    return NextResponse.json({ ok: true, data: productoActualizado });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ ok: false, error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Error al actualizar el producto" }, { status: 500 });
  }
}
