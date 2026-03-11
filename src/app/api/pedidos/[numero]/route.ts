// src/app/api/pedidos/[numero]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PD-0001, PD-123, etc.
const PEDIDO_NUMERO_REGEX = /^PD-\d+$/i;

export async function GET(
  _req: Request,
  { params }: { params: { numero: string } } // Asumiendo Next.js 14+ donde params ya no es Promise
) {
  try {
    const { numero } = params; // Acceso directo en Next.js 14+
    const numeroPedido = numero;

    if (!numeroPedido) {
      return NextResponse.json(
        { error: 'El número de pedido es requerido' },
        { status: 400 }
      );
    }

    // Validar formato primero
    if (!PEDIDO_NUMERO_REGEX.test(numeroPedido)) {
      // Formato inválido => null sin error para que el front no muestre error
      return NextResponse.json(null, { status: 200 });
    }

    // Buscar pedido que esté "En preparación" (estado 17)
    const pedidoEncontrado = await prisma.pedido.findFirst({
      where: {
        numeroPedido,
        estadoPedidoId: 17, // "En preparación"
      },
      include: {
        items: {
          include: {
            producto: true, // Incluir datos del producto
          },
        },
        direccionEnvio: true, // Incluir datos de la dirección
      },
    });

    // Si no se encuentra o no está en estado 17, devolver null (como en tu lógica original)
    if (!pedidoEncontrado) {
        return NextResponse.json(null, { status: 200 });
    }

    // Ya no necesitas esta validación extra porque el where lo maneja
    // if (pedidoEncontrado.estadoPedidoId != 17) {
    //   return NextResponse.json({ error: 'El pedido está cancelado o ya fue procesado' }, { status: 400 });
    // }

    // --- INICIO: Lógica para obtener Stock ---
    const productoIds = pedidoEncontrado.items.map((item) => item.productoId);
    let stockActualDepositoCentral: Record<number, number> = {};

    if (productoIds.length > 0) {
      const stockData = await prisma.stockPorDeposito.findMany({
        where: {
          depositoId: 1, // Stock SÓLO del depósito central (ID 1)
          productoId: {
            in: productoIds,
          },
        },
        select: {
          productoId: true,
          stockActual: true,
        },
      });

      // Crear un mapa { productoId: stock } para fácil acceso
      stockActualDepositoCentral = stockData.reduce((acc, item) => {
        acc[item.productoId] = item.stockActual;
        return acc;
      }, {} as Record<number, number>);
    }

    // Añadir el stock actual a cada item del pedido
    const itemsConStock = pedidoEncontrado.items.map(item => ({
      ...item,
      // Añade el stock encontrado o 0 si no existe registro en StockxDeposito
      stockActualDepositoCentral: stockActualDepositoCentral[item.productoId] ?? 0,
    }));
    // --- FIN: Lógica para obtener Stock ---


    // Buscar el depósito default (ID 1) para enviar sus datos
    const depositoDefault = await prisma.deposito.findUnique({
      where: { id: 1 },
    });


    // Devolver el pedido con los items modificados y el depósito
    return NextResponse.json({
        pedido: {
          ...pedidoEncontrado,
          items: itemsConStock, // Reemplazamos los items originales por los que tienen stock
        },
        deposito: depositoDefault,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al buscar el pedido:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor.' },
      { status: 500 }
    );
  } finally {
    // Asegúrate de desconectar prisma si es necesario en tu configuración (Serverless)
    // await prisma.$disconnect();
  }
}