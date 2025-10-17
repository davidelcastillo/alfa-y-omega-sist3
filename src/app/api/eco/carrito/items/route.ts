import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUsuarioIdFromJwt } from "@/lib/eco/session";

export async function POST(req: Request) {
  try {
    const { productoId, cantidad } = await req.json() as { productoId: number, cantidad?: number };
    if (!productoId) return NextResponse.json({ ok:false, error:"productoId requerido" }, { status:400 });
    const qty = Math.max(1, Number(cantidad ?? 1));

    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok:false, error:"no-auth" }, { status:401 });

    const carrito = await prisma.carrito.upsert({
      where: { usuarioId },
      create: { usuarioId },
      update: {},
      select: { id: true },
    });

    // upsert item
    const item = await prisma.itemCarrito.upsert({
      where: { carritoId_productoId: { carritoId: carrito.id, productoId } },
      update: { cantidad: { increment: qty } },
      create: { carritoId: carrito.id, productoId, cantidad: qty },
    });

    return NextResponse.json({ ok:true, item });
  } catch (e) {
    console.error("[POST /api/eco/carrito/items]", e);
    return NextResponse.json({ ok:false, error:"internal" }, { status:500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { productoId, cantidad } = await req.json() as { productoId: number, cantidad: number };
    if (!productoId || typeof cantidad !== "number")
      return NextResponse.json({ ok:false, error:"payload" }, { status:400 });

    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok:false, error:"no-auth" }, { status:401 });

    const carrito = await prisma.carrito.findUnique({ where: { usuarioId } });
    if (!carrito) return NextResponse.json({ ok:true }); // nada que actualizar

    if (cantidad <= 0) {
      await prisma.itemCarrito.delete({
        where: { carritoId_productoId: { carritoId: carrito.id, productoId } }
      });
      return NextResponse.json({ ok:true, removed: true });
    }

    const item = await prisma.itemCarrito.update({
      where: { carritoId_productoId: { carritoId: carrito.id, productoId } },
      data: { cantidad },
    });
    return NextResponse.json({ ok:true, item });
  } catch (e) {
    console.error("[PATCH /api/eco/carrito/items]", e);
    return NextResponse.json({ ok:false, error:"internal" }, { status:500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productoId = Number(searchParams.get("productoId") || 0);
    if (!productoId) return NextResponse.json({ ok:false, error:"productoId" }, { status:400 });

    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok:false, error:"no-auth" }, { status:401 });

    const carrito = await prisma.carrito.findUnique({ where: { usuarioId } });
    if (!carrito) return NextResponse.json({ ok:true });

    await prisma.itemCarrito.delete({
      where: { carritoId_productoId: { carritoId: carrito.id, productoId } }
    });
    return NextResponse.json({ ok:true });
  } catch (e) {
    console.error("[DELETE /api/eco/carrito/items]", e);
    return NextResponse.json({ ok:false, error:"internal" }, { status:500 });
  }
}
