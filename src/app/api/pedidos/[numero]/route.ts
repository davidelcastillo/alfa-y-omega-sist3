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

    // Si numeroPedido NO es @unique en Prisma, usá findFirst
    const pedido = await prisma.pedido.findFirst({
      where: { numeroPedido },
      include: {
        items: { include: { producto: true } },
      },
    });

    if (!pedido) return NextResponse.json(null, { status: 200 });

    return NextResponse.json(pedido, { status: 200 });
  } catch (error) {
    console.error('Error al buscar el pedido:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor.' },
      { status: 500 }
    );
  }
}
