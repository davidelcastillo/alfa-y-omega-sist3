import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productoId = parseInt(params.id);

    // Verificamos si el producto existe
    const producto = await prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Soft delete
    const productoActualizado = await prisma.producto.update({
      where: { id: productoId },
      data: {
        estado: false,
      },
    });

    return NextResponse.json({
      message: "Producto eliminado (soft delete) correctamente",
      producto: productoActualizado,
    });
  } catch (error) {
    console.error("Error en soft delete:", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
