import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUsuarioIdFromJwt } from "@/lib/eco/session";

export async function GET(req: Request) {
  try {
    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok:false, error:"no-auth" }, { status:401 });

    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
      include: {
        items: {
          include: {
            producto: { select: { nombre: true, precioVenta: true, imagenes: { take:1, orderBy:{ orden:"asc" }, select:{ url:true } } } }
          }
        }
      }
    });

    const items = (carrito?.items ?? []).map(it => ({
      id: it.productoId,
      name: it.producto.nombre,
      image: it.producto.imagenes[0]?.url ?? "/placeholder.png",
      price: it.producto.precioVenta ?? 0,
      quantity: it.cantidad,
    }));

    return NextResponse.json({ ok:true, items });
  } catch (e) {
    console.error("[GET /api/eco/carrito]", e);
    return NextResponse.json({ ok:false, error:"internal" }, { status:500 });
  }
}
