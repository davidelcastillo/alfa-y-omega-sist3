import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validación de los datos de entrada
const depositoSchema = z.object({
  nombre: z.string().min(1),
  ubicacion: z.string().min(1),
  tipo: z.enum(["Principal", "Sucursal", "Temporal", "Tránsito"]),
  capacidad: z.number().int().positive().optional(),
  estado: z.boolean(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = depositoSchema.parse(body);

    const depositoActualizado = await prisma.deposito.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(depositoActualizado);
  } catch (error: any) {
    console.error("Error al actualizar depósito:", error);

    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error al actualizar el depósito" },
      { status: 500 }
    );
  }
}