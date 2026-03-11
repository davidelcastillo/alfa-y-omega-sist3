import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUsuarioIdFromJwt } from "@/lib/eco/session";
import { z } from "zod";

const CheckoutSchema = z.object({
  metodoEnvioId: z.number(),
});

export async function POST(req: Request) {
  try {
    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok: false, error: "no-auth" }, { status: 401 });

    const body = await req.json();
    const { metodoEnvioId } = CheckoutSchema.parse(body);

    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
      include: { items: { include: { producto: true } } },
    });
    if (!carrito || carrito.items.length === 0) throw new Error("Carrito vacío");

    const metodoEnvio = await prisma.metodoEnvio.findUnique({
      where: { id: metodoEnvioId },
    });
    if (!metodoEnvio) throw new Error("Método de envío no encontrado");

    const itemsCalc = carrito.items.map((i) => ({
      precio: i.producto.precioVenta ?? 0,
      cantidad: i.cantidad,
    }));
    const subtotal = itemsCalc.reduce((a, x) => a + x.cantidad * x.precio, 0);
    const costoEnvio = metodoEnvio.costo;
    const total = subtotal + costoEnvio;

    // TODO: A futuro, se puede crear una "pre-orden" o "intento de pago"
    // para poder guardar el carrito y el total, y evitar que el usuario
    // modifique el carrito durante el pago.

    return NextResponse.json({ ok: true, total });
  } catch (e: any) {
    console.error("[POST /api/eco/checkout]", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "internal" },
      { status: 500 }
    );
  }
}