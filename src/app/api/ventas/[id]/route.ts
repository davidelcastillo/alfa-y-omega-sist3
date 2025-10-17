// src/app/api/ventas/[id]/route.ts
import { NextResponse } from "next/server";
import { getOrderDetail } from "@/server/ventas.service";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const detail = await getOrderDetail(params.id);
    if (!detail) {
      return NextResponse.json({ message: "Pedido no encontrado" }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch (error) {
    console.error("Error al obtener el detalle:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al intentar obtener el detalle." },
      { status: 500 }
    );
  }
}
