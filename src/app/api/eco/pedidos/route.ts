// src/app/api/eco/pedidos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUsuarioIdFromJwt } from "@/lib/eco/session";
import { z } from "zod";

const CreatePedidoSchema = z.object({
  direccionEnvioId: z.number().int().positive(),
  metodoEnvioId: z.number().int().positive(),
  observaciones: z.string().optional(),
  // opcional: transaccionId del proveedor de pagos (MercadoPago/Stripe)
  transaccionIdProveedor: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const usuarioId = await getUsuarioIdFromJwt(req);
    if (!usuarioId) return NextResponse.json({ ok: false, error: "no-auth" }, { status: 401 });

    const body = await req.json();
    const { direccionEnvioId, metodoEnvioId, observaciones, transaccionIdProveedor } =
      CreatePedidoSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      // traer carrito con productos y precios
      const carrito = await tx.carrito.findUnique({
        where: { usuarioId },
        include: { items: { include: { producto: true } } },
      });
      if (!carrito || carrito.items.length === 0) throw new Error("Carrito vacío");

      // buscar estados / tipos requeridos
      const [
        estadoPedido,
        tipoComprobanteFactura,
        tipoMovimientoIngreso,
        metodoEnvio,
        depositoCentral,
      ] = await Promise.all([
        tx.estadoPedido.findFirst({ where: { nombre: "En Preparación" }, select: { id: true } }),
        tx.tipoComprobante.findFirst({ where: { nombre: "Factura" }, select: { id: true } }),
        tx.tipoMovimiento.findFirst({ where: { nombre: "Egreso por Venta" }, select: { id: true } }),
        tx.metodoEnvio.findUnique({ where: { id: metodoEnvioId } }),
        tx.deposito.findUnique({ where: { id: 1 }, select: { id: true } }), // depósito central = id 1
      ]);

      if (!estadoPedido) throw new Error("Estado de pedido 'En Preparación' no encontrado");
      if (!tipoComprobanteFactura) throw new Error("Tipo de comprobante 'Factura' no encontrado");
      if (!metodoEnvio) throw new Error("Método de envío no encontrado");
      if (!depositoCentral) throw new Error("Depósito central (id=1) no encontrado");

      // asegurarse de que exista MetodoPago "Tarjeta Crédito"
      let metodoPagoRecord = await tx.metodoPago.findFirst({ where: { nombre: "Tarjeta Crédito" } });
      if (!metodoPagoRecord) {
        metodoPagoRecord = await tx.metodoPago.create({ data: { nombre: "Tarjeta Crédito" } });
      }

      // calcular totales desde el carrito
      const itemsCalc = carrito.items.map((i) => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
        precio: i.producto.precioVenta ?? 0,
      }));
      const subtotal = itemsCalc.reduce((a, x) => a + x.cantidad * x.precio, 0);
      const costoEnvio = metodoEnvio.costo ?? 0;
      const total = subtotal + costoEnvio;

      // 1) crear el Pedido (con detalle)
      const pedido = await tx.pedido.create({
        data: {
          usuarioId,
          direccionEnvioId,
          metodoEnvioId,
          subtotal,
          costoEnvio,
          total,
          estadoPedidoId: estadoPedido.id,
          observaciones: observaciones ?? null,
          items: {
            create: itemsCalc.map((x) => ({
              productoId: x.productoId,
              cantidad: x.cantidad,
              precioUnitarioAlComprar: x.precio,
            })),
          },
        },
      });

      // ==== Generar número correlativo formato CC-0001 ====
      // buscamos el último comprobante con numero que empiece por 'CC-'
      const last = await tx.comprobanteCliente.findFirst({
        where: { numero: { startsWith: "CC-" } },
        orderBy: { id: "desc" },
        select: { numero: true },
      });

      let nextNumeroStr = "CC-0001";
      if (last?.numero) {
        // extraer la parte numérica después del guion
        const parts = last.numero.split("-");
        const lastNum = Number(parts[1] ?? NaN);
        if (!Number.isNaN(lastNum)) {
          const next = lastNum + 1;
          nextNumeroStr = `CC-${String(next).padStart(4, "0")}`;
        } else {
          // caso raro: si el last.numero no tiene formato parseable, tratamos como 1
          nextNumeroStr = "CC-0001";
        }
      }
      // ===================================================

      // 2) crear ComprobanteCliente (Factura) ligado al pedido
      const comprobante = await tx.comprobanteCliente.create({
        data: {
          usuarioId,
          tipoComprobanteId: tipoComprobanteFactura.id,
          fecha: new Date(),
          hora: null,
          total,
          saldo: 0, // como ya se paga en tarjeta, saldo 0
          estado: true,
          observaciones: `Comprobante (Factura) generado al crear pedido ${pedido.id}`,
          tipoMovimientoId: tipoMovimientoIngreso?.id ?? undefined,
          direccionId: direccionEnvioId,
          depositoId: depositoCentral.id,       // <-- depósito central fijo = 1
          metodoPagoId: metodoPagoRecord.id,    // <-- MetodoPago: Tarjeta Crédito
          numero: nextNumeroStr,                // <-- número correlativo CC-0001
          detalleComprobante: {
            create: itemsCalc.map((x) => ({
              productoId: x.productoId,
              cantidad: x.cantidad,
              precioUnitario: x.precio,
            })),
          },
        },
      });

      // 3) registrar Pago (marcar como pagado con Tarjeta Crédito)
      const pago = await tx.pago.create({
        data: {
          pedidoId: pedido.id,
          monto: total,
          metodoPago: "Tarjeta Crédito",
          estado: "Pagado",
          transaccionIdProveedor: transaccionIdProveedor ?? null,
          // fechaPago tiene default now()
        },
      });

      // 4) limpiar carrito (eliminar ítems)
      await tx.itemCarrito.deleteMany({ where: { carritoId: carrito.id } });

      // No se toca stock ni se generan movimientos automáticos.
      return {
        pedidoId: pedido.id,
        comprobanteId: comprobante.id,
        pagoId: pago.id,
        total,
        numeroComprobante: nextNumeroStr,
      };
    });

    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (e: any) {
    console.error("[POST /api/eco/pedidos]", e);
    if (e instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "invalid-payload", details: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: e?.message || "internal" }, { status: 500 });
  }
}
