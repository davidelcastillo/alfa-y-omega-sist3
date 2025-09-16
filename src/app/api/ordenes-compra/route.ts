import { NextRequest, NextResponse } from 'next/server';
import { getOrdenesCompra } from '@/server/ordenes-compra.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const estado = searchParams.get("estado")
      ? searchParams.get("estado") === "true"
      : undefined;
    const proveedorId = searchParams.get("proveedorId")
      ? Number(searchParams.get("proveedorId"))
      : undefined;
    const depositoId = searchParams.get("depositoId")
      ? Number(searchParams.get("depositoId"))
      : undefined;
    const fecha_desde = searchParams.get("fecha_desde") || undefined;
    const fecha_hasta = searchParams.get("fecha_hasta") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = (searchParams.get("sort") as "asc" | "desc") || "desc";

    const result = await getOrdenesCompra({
      page,
      limit,
      estado,
      proveedorId,
      depositoId,
      fecha_desde,
      fecha_hasta,
      search,
      sort,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET /ordenes-compra:", error);
    return NextResponse.json(
      { message: "Error al obtener órdenes de compra" },
      { status: 500 }
    );
  }
}
