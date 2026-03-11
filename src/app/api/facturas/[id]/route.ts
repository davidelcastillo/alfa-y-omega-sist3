// src/app/api/facturas/[id]/route.ts
import { NextResponse } from "next/server";
import { getFacturaDetail } from "@/server/facturas/service"; // <-- MODIFICADO

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const detail = await getFacturaDetail(params.id); // <-- MODIFICADO
    if (!detail) {
      return NextResponse.json({ message: "Factura no encontrada" }, { status: 404 }); // <-- MODIFICADO
    }
    return NextResponse.json(detail);
  } catch (error) {
    console.error("Error al obtener el detalle de la factura:", error); // <-- MODIFICADO
    return NextResponse.json(
      { message: "Error interno del servidor al intentar obtener el detalle." },
      { status: 500 }
    );
  }
}