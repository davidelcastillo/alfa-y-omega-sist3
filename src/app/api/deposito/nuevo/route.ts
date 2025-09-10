import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validaciones de entrada con Zod
const depositoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  ubicacion: z.string().min(1, "La ubicación es obligatoria"),
  tipo: z.enum(["Principal", "Sucursal", "Temporal", "Tránsito"]),
  capacidad: z
    .number()
    .positive("La capacidad debe ser mayor que cero")
    .optional(), // en Prisma es Int? o Float? así que lo dejamos como opcional

  provincia: z.string().min(1).optional(), // provincia es opcional por el momento
  ciudad: z.string().min(1).optional(),    // ciudad es opcional por el momento
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validar los datos con Zod
    const data = depositoSchema.parse(body);

    // Verificar si ya existe un depósito con el mismo nombre y ubicación
    const depositoExistente = await prisma.deposito.findFirst({
      where: {
        nombre: data.nombre.trim(),
        ubicacion: data.ubicacion.trim(),
      },
    });

    if (depositoExistente) {
      return NextResponse.json(
        { error: "Ya existe un depósito con ese nombre y ubicación" },
        { status: 400 }
      );
    }

    // Crear nuevo depósito
    const nuevoDeposito = await prisma.deposito.create({
      data: {
        nombre: data.nombre.trim(),
        ubicacion: data.ubicacion.trim(),
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
      console.error("❌ Error de validación Zod:", error.flatten());

      return NextResponse.json(
        {
          error: "Datos inválidos",
          detalles: error.flatten(), // Muestra errores por campo
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno al registrar el depósito" },
      { status: 500 }
    );
  }
}
