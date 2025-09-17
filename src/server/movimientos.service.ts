// src/server/movimientos.service.ts
import { prisma } from '@/lib/prisma';

type DetalleDTO = {
  productoId: number;
  cantidad: number;
};

type CreateMovimientoDTO = {
  depositoId: number;
  tipoMovimientoId: number;
  tipoComprobanteId: number;
  numeroComprobante?: string | null;
  comentario?: string | null; // <- en el schema está con mayúscula
  detalles: DetalleDTO[];
};

export async function createMovimiento(data: CreateMovimientoDTO) {
  return await prisma.$transaction(async (tx) => {
    // 1) TipoMovimiento para saber el signo (saldo = true → suma)
    const tipo = await tx.tipoMovimiento.findUnique({
      where: { id: data.tipoMovimientoId },
      select: { id: true, saldo: true, nombre: true },
    });
    if (!tipo) throw new Error('Tipo de movimiento inexistente');

    const signo = tipo.saldo ? +1 : -1;

    // 2) Validaciones básicas
    const [deposito, tipoComp] = await Promise.all([
      tx.deposito.findUnique({ where: { id: data.depositoId }, select: { id: true, estado: true } }),
      tx.tipoComprobante.findUnique({ where: { id: data.tipoComprobanteId }, select: { id: true } }),
    ]);
    if (!deposito) throw new Error('Depósito inexistente');
    if (!deposito.estado) throw new Error('El depósito está inactivo');
    if (!tipoComp) throw new Error('Tipo de comprobante inexistente');

    // 3) Crear cabecera de Movimiento
    const movimiento = await tx.movimientoStock.create({
      data: {
        depositoId: data.depositoId,
        tipoMovimientoId: data.tipoMovimientoId,
        tipoComprobanteId: data.tipoComprobanteId,
        numeroComprobante: data.numeroComprobante ?? null,
        comentario: data.comentario ?? null, // <- campo de tu schema
        // fecha/hora tienen default(now())
      },
      select: { id: true, depositoId: true, fecha: true },
    });

    // 4) Procesar detalles
    for (const det of data.detalles) {
      // 4.1) Producto activo
      const producto = await tx.producto.findUnique({
        where: { id: det.productoId },
        select: { id: true, estado: true },
      });
      if (!producto) throw new Error('Producto inexistente');
      if (!producto.estado) throw new Error('Producto inactivo');

      // 4.2) Asegurar fila de stock (compuesto productoId+depositoId)
      const spd = await tx.stockPorDeposito.upsert({
        where: {
          productoId_depositoId: {
            productoId: det.productoId,
            depositoId: movimiento.depositoId,
          },
        },
        create: {
          productoId: det.productoId,
          depositoId: movimiento.depositoId,
          stockActual: 0,
        },
        update: {},
        select: { id: true, stockActual: true },
      });

      // 4.3) Nuevo stock
      const nuevoStock = spd.stockActual + signo * det.cantidad;
      if (nuevoStock < 0) throw new Error('Stock insuficiente');

      // 4.4) Actualizar stock
      await tx.stockPorDeposito.update({
        where: { id: spd.id },
        data: { stockActual: nuevoStock },
      });

      // 4.5) Crear detalle
      await tx.detalleMovimiento.create({
        data: {
          movimientoId: movimiento.id,
          productoId: det.productoId,
          cantidad: det.cantidad,
        },
      });
    }

    // 5) Devolver resumen
    return tx.movimientoStock.findUnique({
      where: { id: movimiento.id },
      include: {
        deposito: { select: { id: true, nombre: true } },
        tipoMovimiento: { select: { id: true, nombre: true, saldo: true } },
        tipoComprobante: { select: { id: true, nombre: true } },
        detalles: {
          select: {
            id: true,
            producto: { select: { id: true, nombre: true } },
            cantidad: true,
          },
        },
      },
    });
  });
}
