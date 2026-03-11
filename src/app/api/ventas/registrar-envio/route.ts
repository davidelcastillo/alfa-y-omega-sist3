
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createMovimiento } from '@/server/movimientos.service';

const EGRESO_VENTA_ID = 6;
const DEPOSITO_CENTRAL_ID = 1;
const ESTADO_ENVIADO_ID = 18;
const TIPO_COMPROBANTE_PEDIDO_ID = 1;


export async function POST(request: Request) {
  try {
    const {
      pedidoDbId,
      numeroComprobante,
      comentario,
      detalles,
    } = await request.json();

    if (!pedidoDbId || !numeroComprobante || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Registrar el egreso de stock
      const movimiento = await createMovimiento({
        depositoId: DEPOSITO_CENTRAL_ID,
        tipoMovimientoId: EGRESO_VENTA_ID,
        tipoComprobanteId: TIPO_COMPROBANTE_PEDIDO_ID,
        numeroComprobante,
        comentario,
        detalles,
      });

      // 2. Actualizar el estado del pedido
      const pedidoActualizado = await tx.pedido.update({
        where: { id: pedidoDbId },
        data: { estadoPedidoId: ESTADO_ENVIADO_ID },
      });

      return { movimiento, pedidoActualizado };
    });

    return NextResponse.json({
      message: 'Envío registrado y pedido actualizado con éxito',
      data: resultado,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error en la transacción de registro de envío:', error);

    // Check for specific error messages to return appropriate status codes
    if (error.message.includes('Stock insuficiente')) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}
