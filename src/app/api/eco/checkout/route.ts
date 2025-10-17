import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUsuarioIdFromJwt } from "@/lib/eco/session";

export async function POST(req: Request) {
  try {
    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok:false, error:"no-auth" }, { status:401 });

    const { direccionEnvioId, metodoEnvioId } = await req.json() as { direccionEnvioId: number, metodoEnvioId: number };

    const result = await prisma.$transaction(async tx => {
      const carrito = await tx.carrito.findUnique({
        where: { usuarioId },
        include: { items: { include: { producto: true } } }
      });
      if (!carrito || carrito.items.length === 0) throw new Error("Carrito vacío");

      const itemsCalc = carrito.items.map(i => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
        precio: i.producto.precioVenta ?? 0,
      }));
      const subtotal = itemsCalc.reduce((a,x)=>a + x.cantidad * x.precio, 0);
      const costoEnvio = 0; // tu lógica
      const total = subtotal + costoEnvio;

      // 1) crear pedido + detalle
      const pedido = await tx.pedido.create({
        data: {
          usuarioId, direccionEnvioId, metodoEnvioId,
          subtotal, costoEnvio, total,
          estadoPedidoId: 1, // PENDIENTE (ajusta al id real)
          items: {
            create: itemsCalc.map(x => ({
              productoId: x.productoId,
              cantidad: x.cantidad,
              precioUnitarioAlComprar: x.precio
            }))
          }
        }
      });

      // 2) egresar stock por depósitos (greedy)
      for (const it of itemsCalc) {
        let restante = it.cantidad;

        const stocks = await tx.stockPorDeposito.findMany({
          where: { productoId: it.productoId, stockActual: { gt: 0 } },
          orderBy: { depositoId: "asc" }
        });

        for (const s of stocks) {
          if (restante <= 0) break;
          const egresar = Math.min(restante, s.stockActual);

          const upd = await tx.stockPorDeposito.updateMany({
            where: { id: s.id, stockActual: { gte: egresar } },
            data: { stockActual: { decrement: egresar } }
          });
          if (upd.count === 0) continue;

          const mov = await tx.movimientoStock.create({
            data: {
              depositoId: s.depositoId,
              tipoMovimientoId: 2,      // EGRESO (ajusta id real)
              tipoComprobanteId: 1,     // VENTA (ajusta id real)
              numeroComprobante: String(pedido.id),
              comentario: "Venta e-commerce"
            }
          });
          await tx.detalleMovimiento.create({
            data: { movimientoId: mov.id, productoId: it.productoId, cantidad: egresar }
          });

          restante -= egresar;
        }
        if (restante > 0) throw new Error(`Stock insuficiente para producto ${it.productoId}`);
      }

      // 3) limpiar carrito
      await tx.itemCarrito.deleteMany({ where: { carritoId: carrito.id } });

      return { pedidoId: pedido.id, total };
    });

    return NextResponse.json({ ok:true, ...result });
  } catch (e:any) {
    console.error("[POST /api/eco/checkout]", e);
    return NextResponse.json({ ok:false, error: e?.message || "internal" }, { status:500 });
  }
}
