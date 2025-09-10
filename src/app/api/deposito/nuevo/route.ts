import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validaciones de entrada
const depositoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  ubicacion: z.string().min(1, "La ubicación es obligatoria"),
  tipo: z.enum(["Principal", "Sucursal", "Temporal", "Tránsito"]),
  capacidad: z.number().int().positive().optional(), // m2 opcional

  // NUEVOS CAMPOS (opcionales por ahora)
  provincia: z.string().min(2).max(80).optional(),
  ciudad: z.string().min(2).max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = depositoSchema.parse(body);

    const nuevoDeposito = await prisma.deposito.create({
      data: {
        nombre: data.nombre,
        ubicacion: data.ubicacion,
        tipo: data.tipo,
        capacidad: data.capacidad ?? null,
        estado: true,
        
        // Guardamos null si no viene (porque en Prisma están como String?)
        provincia: data.provincia ?? null,
        ciudad: data.ciudad ?? null,
      },
    });

    return NextResponse.json(nuevoDeposito, { status: 201 });
  } catch (error) {
    console.error("Error registrando depósito:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno al registrar el depósito" },
      { status: 500 }
    );
  }
}
