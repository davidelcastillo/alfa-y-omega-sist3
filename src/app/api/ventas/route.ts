// app/api/pedidos/route.ts
import { NextResponse, NextRequest } from "next/server";
import { listOrders } from "@/server/ventas.service"; // Asegúrate de que la ruta sea correcta
import type { FiltersState } from "@/lib/ventas/types";

export async function GET(request: NextRequest) {
  try {
    // Obtenemos los searchParams de la URL.
    const searchParams = request.nextUrl.searchParams;

    // Creamos un objeto de filtros a partir de los searchParams.
    const filters: FiltersState = {
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      orderNumber: searchParams.get("orderNumber") || undefined,
      // Hacemos un type casting seguro para el status
      status: searchParams.get("status") as FiltersState["status"] || undefined,
    };

    // Llamamos a la función del servicio para obtener los pedidos, aplicando los filtros.
    const pedidos = await listOrders(filters);

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error interno del servidor al intentar obtener los pedidos.",
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}