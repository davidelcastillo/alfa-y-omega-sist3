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
  detalles: DetalleDTO[];
};

export async function createMovimiento(data: CreateMovimientoDTO) {
  return await prisma.$transaction(async (tx) => {
    // 1) Cargar TipoMovimiento para conocer el signo (saldo = true → suma stock)
    const tipo = await tx.tipoMovimiento.findUnique({
      where: { id: data.tipoMovimientoId },
      select: { id: true, saldo: true, nombre: true },
    });
    if (!tipo) throw new Error('Tipo de movimiento inexistente');

    const signo = tipo.saldo ? +1 : -1;

    // 2) Validaciones de existencia básicas
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
        // fecha/hora usan default(now())
      },
      select: { id: true, depositoId: true, fecha: true },
    });

    // 4) Procesar cada detalle
    for (const det of data.detalles) {
      // 4.1) Validar producto y estado
      const producto = await tx.producto.findUnique({
        where: { id: det.productoId },
        select: { id: true, estado: true },
      });
      if (!producto) throw new Error('Producto inexistente');
      if (!producto.estado) throw new Error('Producto inactivo');

      // 4.2) Asegurar fila de stock (upsert por compuesto productoId+depositoId)
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

      // 4.3) Calcular nuevo stock según signo
      const nuevoStock = spd.stockActual + signo * det.cantidad;

      // Regla de negocio: no permitir stock negativo en egresos
      if (nuevoStock < 0) {
        throw new Error('Stock insuficiente');
      }

      // 4.4) Actualizar stock
      await tx.stockPorDeposito.update({
        where: { id: spd.id },
        data: { stockActual: nuevoStock },
      });

      // 4.5) Crear detalle del movimiento
      await tx.detalleMovimiento.create({
        data: {
          movimientoId: movimiento.id,
          productoId: det.productoId,
          cantidad: det.cantidad,
        },
      });
    }

    // 5) Devolver cabecera con un resumen simple
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
