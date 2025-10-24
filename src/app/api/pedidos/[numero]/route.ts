// src/app/api/pedidos/[numero]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PD-0001, PD-123, etc.
const PEDIDO_NUMERO_REGEX = /^PD-\d+$/i;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ numero: string }> } // 👈 params es Promise en Next 15
) {
  try {
    const { numero } = await ctx.params;       // 👈 await antes de usar
    const numeroPedido = numero;

    if (!numeroPedido) {
      return NextResponse.json(
        { error: 'El número de pedido es requerido' },
        { status: 400 }
      );
    }

    if (!PEDIDO_NUMERO_REGEX.test(numeroPedido)) {
      // Formato inválido => null sin error para que el front no muestre error
      return NextResponse.json(null, { status: 200 });
    }

    const pedidoEncontrado = await prisma.pedido.findFirst({
      where: {
        numeroPedido,
        estadoPedidoId: 17, // "En preparación"
      },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
        direccionEnvio: true, // <--- AÑADIDO
      },
    });

    if (!pedidoEncontrado) return NextResponse.json(null, { status: 200 });

    if (pedidoEncontrado.estadoPedidoId != 17) {
      return NextResponse.json({ error: 'El pedido está cancelado o ya fue procesado' }, { status: 400 });
    }

    const depositoDefault = await prisma.deposito.findUnique({
      where: { id: 1 }, // Asumimos que el depósito con ID 1 es el de envíos.
    });

    return new Response(
      JSON.stringify({
        pedido: pedidoEncontrado,
        deposito: depositoDefault,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al buscar el pedido:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor.' },
      { status: 500 }
    );
  }
}
