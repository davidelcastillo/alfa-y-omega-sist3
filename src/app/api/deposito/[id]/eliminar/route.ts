import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { id } from "zod/v4/locales";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const depositoId = parseInt(params.id);

    // Verificar que el depósito exista
    const deposito = await prisma.deposito.findUnique({
      where: { id: depositoId },
    });

    if (!deposito) {
      return NextResponse.json(
        { error: "Depósito no encontrado" },
        { status: 404 }
      );
    }

    // Soft delete → estado = false
    const depositoActualizado = await prisma.deposito.update({
      where: { id: depositoId },
      data: { estado: false },
    });

    return NextResponse.json({
      message: "Depósito eliminado (soft delete) correctamente",
      deposito: depositoActualizado,
    });
  } catch (error) {
    console.error("Error en soft delete de depósito:", error);
    return NextResponse.json(
      { error: "Error al eliminar el depósito" },
      { status: 500 }
    );
  }
}