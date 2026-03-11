// src/app/api/depositos/[id]/productos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// La firma de la función es correcta, el problema es el acceso a 'params'
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  // --- PASO 1: Depuración ---
  // Este log nos mostrará si estamos recibiendo el ID correctamente.
  console.log("[API LOG] Recibiendo parámetros:", params);

  // --- PASO 2: Corrección y Validación ---
  // Usamos parseInt que es más seguro para IDs numéricos y validamos el resultado.
  const depositoId = parseInt(params.id, 10);
  console.log("[API LOG] ID del depósito convertido:", depositoId);

  if (isNaN(depositoId)) { // isNaN es la forma correcta de verificar si es un número inválido
    return NextResponse.json({ ok: false, error: "ID de depósito inválido" }, { status: 400 });
  }

  // El resto de tu lógica es casi perfecta, la mantenemos.
  const { searchParams } = new URL(_req.url);
  const search = searchParams.get("search")?.trim() || "";
  const brandIdStr = searchParams.get("brandId");
  const categoryIdStr = searchParams.get("categoryId");
  const unitIdStr = searchParams.get("unitId");
  const inStockOnly = searchParams.get("inStockOnly") === "1";
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 24), 1), 100);

  const brandId = brandIdStr ? parseInt(brandIdStr, 10) : undefined;
  const categoryId = categoryIdStr ? parseInt(categoryIdStr, 10) : undefined;
  const unitId = unitIdStr ? parseInt(unitIdStr, 10) : undefined;
  
  // Log para ver qué filtros se están aplicando
  console.log("[API LOG] Filtros aplicados:", { search, brandId, categoryId, unitId, inStockOnly });

  try {
    const rows = await prisma.producto.findMany({
      where: {
        publicado: false,
        stockProductos: { 
            some: { 
                depositoId, 
            //...(inStockOnly && { stockActual: { gt: 0 } }) 
            } 
             },
        ...(search ? { nombre: { contains: search, mode: "insensitive" } } : {}),
        ...(brandId && !isNaN(brandId) ? { marcaId: brandId } : {}),
        ...(categoryId && !isNaN(categoryId) ? { rubroId: categoryId } : {}),
        ...(unitId && !isNaN(unitId) ? { unidadId: unitId } : {}),
      },
      select: {
        id: true,
        nombre: true,
        precioVenta: true,
        rubro: { select: { nombre: true } },
        marca: { select: { nombre: true } },
        unidad: { select: { nombre: true } },
        imagenes: { orderBy: { orden: "asc" }, take: 1, select: { url: true } },
      },
      orderBy: { nombre: "asc" },
      take: limit,
    });

    const data = rows.map(r => ({
      id: r.id,
      nombre: r.nombre,
      rubro: r.rubro?.nombre ?? null,
      marca: r.marca?.nombre ?? null,
      unidad: r.unidad?.nombre ?? null,
      imageUrl: r.imagenes[0]?.url ?? null,
      precioVenta: r.precioVenta ?? null,
    }));

    // Log para ver si encontramos datos antes de enviarlos
    console.log(`[API LOG] Se encontraron ${data.length} productos.`);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error en /api/depositos/[id]/productos:", err);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}