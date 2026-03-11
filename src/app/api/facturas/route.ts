// src/app/api/facturas/route.ts
import { NextResponse, NextRequest } from "next/server";
import { listFacturas } from "@/server/facturas/service"; // <-- MODIFICADO
import type { FiltersState } from "@/lib/facturas/types"; // <-- MODIFICADO

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: FiltersState = {
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      numeroComprobante: searchParams.get("numeroComprobante") || undefined,
      estadoPago: (searchParams.get("estadoPago") as FiltersState["estadoPago"]) || undefined,
    };

    const facturas = await listFacturas(filters); // <-- MODIFICADO

    return NextResponse.json(facturas);
  } catch (error) {
    console.error("Error al obtener las facturas:", error); // <-- MODIFICADO
    return new NextResponse(
      JSON.stringify({
        message: "Error interno del servidor al intentar obtener las facturas.", // <-- MODIFICADO
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}