import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Definimos el esquema de validación
const productoSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  precioCompra: z.number().positive(),
  precioVenta: z.number().positive(),
  rubroId: z.number().int().positive(),
  marcaId: z.number().int().positive(),
  unidadId: z.number().int().positive(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    //  Acá se valida lo que viene en el body
    const body = await req.json();
    const data = productoSchema.parse(body);

    const productoActualizado = await prisma.producto.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(productoActualizado);
  } catch (error: any) {
    if (error.name === "ZodError") {
      // Si falla la validación, se devuelve un 400
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
  }
}