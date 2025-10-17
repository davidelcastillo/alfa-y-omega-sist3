import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUsuarioIdFromJwt } from "@/lib/eco/session";
import { z } from "zod";

const CreatePedidoSchema = z.object({
  direccionEnvioId: z.number(),
  metodoEnvioId: z.number(),
});

// TODO: Documentar en el front-end cómo usar esta API.
// - El front debe llamar a POST /api/eco/checkout para obtener el total.
// - Con el total, el front debe procesar el pago (ej: MercadoPago, Stripe).
// - Una vez que el pago es exitoso, el front debe llamar a POST /api/eco/pedidos.
//   Esta API se encarga de crear el pedido, descontar stock y limpiar el carrito.
export async function POST(req: Request) {
  try {
    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok: false, error: "no-auth" }, { status: 401 });

    const body = await req.json();
    const { direccionEnvioId, metodoEnvioId } = CreatePedidoSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const carrito = await tx.carrito.findUnique({
        where: { usuarioId },
        include: { items: { include: { producto: true } } },
      });
      if (!carrito || carrito.items.length === 0) throw new Error("Carrito vacío");

      const [estadoPedido, tipoMovimiento, tipoComprobante, metodoEnvio] = await Promise.all([
        tx.estadoPedido.findFirst({ where: { nombre: "En Preparación" }, select: { id: true } }),
        tx.tipoMovimiento.findFirst({ where: { nombre: "EGRESO" }, select: { id: true } }),
        tx.tipoComprobante.findFirst({ where: { nombre: "VENTA" }, select: { id: true } }),
        tx.metodoEnvio.findUnique({ where: { id: metodoEnvioId } }),
      ]);

      if (!estadoPedido) throw new Error("Estado de pedido 'En Preparación' no encontrado");
      
     
      if (!metodoEnvio) throw new Error("Método de envío no encontrado");

      const itemsCalc = carrito.items.map((i) => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
        precio: i.producto.precioVenta ?? 0,
      }));
      const subtotal = itemsCalc.reduce((a, x) => a + x.cantidad * x.precio, 0);
      const costoEnvio = metodoEnvio.costo;
      const total = subtotal + costoEnvio;

      // 1) crear pedido + detalle
      const pedido = await tx.pedido.create({
        data: {
          usuarioId,
          direccionEnvioId,
          metodoEnvioId,
          subtotal,
          costoEnvio,
          total,
          estadoPedidoId: estadoPedido.id,
          items: {
            create: itemsCalc.map((x) => ({
              productoId: x.productoId,
              cantidad: x.cantidad,
              precioUnitarioAlComprar: x.precio,
            })),
          },
        },
      });

      

      // 2) limpiar carrito
      await tx.itemCarrito.deleteMany({ where: { carritoId: carrito.id } });

      return { pedidoId: pedido.id, total };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    console.error("[POST /api/eco/pedidos]", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "internal" },
      { status: 500 }
    );
  }
}