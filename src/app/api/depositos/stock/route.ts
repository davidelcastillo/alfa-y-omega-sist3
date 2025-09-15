// src/app/api/depositos/stock/route.ts  ------------------- NUEVO ARCHIVO TRAE TODOS LOS PRODUCTOS DE LOS DEPOSITOS
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
  try {
    // 1. leer query params (si los querés usar después, ej. filtros)
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase() ?? "";

    // 2. traer TODOS los productos en TODOS los depósitos
    const items = await prisma.stockPorDeposito.findMany({
      include: {
        deposito: true,
        producto: true,
      },
        orderBy: [
            // ORDENA LOS PRODUCTOS POR DEPOSITO, NO ES EL FILTRO, ES LO QUE SE MUESTRA POR DEFECTO CUANDO SE INGRESA A LA PAGINA
            { deposito: { nombre: "asc" } }, // primero ordena por nombre de depósito
            { producto: { nombre: "asc" } }, // luego por nombre de producto
        ],
    });

    // 3. mapear al formato esperado por el front
    const data = items
      .filter((s) =>
        q ? s.producto.nombre.toLowerCase().includes(q) : true
      )
      .map((s) => ({
        id: s.id,
        depositId: s.depositoId,
        productId: s.productoId,
        depositNombre: s.deposito.nombre,
        depositUbicacion: s.deposito.ubicacion,
        productDescripcion: s.producto.nombre,
        stockActual: s.stockActual,
        stockMinimo: s.stockMinimo,
        stockMaximo: s.stockMaximo ?? 0,
      }));

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("Error en /api/depositos/stock:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
