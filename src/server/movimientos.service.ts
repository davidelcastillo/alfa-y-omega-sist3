// src/server/movimientos.service.ts
import { prisma } from "@/lib/prisma";

type MovimientoDetalle = { productoId: number; cantidad: number };
type CreateMovimientoDTO = {
  depositoId: number;
  tipoMovimientoId: number;  // 1=Ingreso, 2=Egreso (según tu seed)
  tipoComprobanteId: number;
  detalles: MovimientoDetalle[];
};

export async function crearMovimiento(data: CreateMovimientoDTO) {
  return prisma.$transaction(async (tx) => {
    // Validaciones base (existencia)
    const [deposito, tipoMov, tipoComprobante] = await Promise.all([
      tx.deposito.findUnique({ where: { id: data.depositoId } }),
      tx.tipoMovimiento.findUnique({ where: { id: data.tipoMovimientoId } }),
      tx.tipoComprobante.findUnique({ where: { id: data.tipoComprobanteId } }),
    ]);
    if (!deposito) throw new Error("Depósito no existe");
    if (!tipoMov) throw new Error("Tipo de movimiento no existe");
    if (!tipoComprobante) throw new Error("Tipo de comprobante no existe");
    if (!data.detalles?.length) throw new Error("Detalles vacíos");

    const esIngreso = tipoMov.ingresoEgreso === true;

    // Deduplicar por producto para validar/actualizar stock eficientemente
    const agregados = new Map<number, number>();
    for (const d of data.detalles) {
      if (d.cantidad <= 0) throw new Error(`Cantidad inválida para producto ${d.productoId}`);
      agregados.set(d.productoId, (agregados.get(d.productoId) ?? 0) + d.cantidad);
    }
    const productIds = [...agregados.keys()];

    // Validar productos activos
    const activos = await tx.producto.findMany({
      where: { id: { in: productIds }, estado: true },
      select: { id: true },
    });
    if (activos.length !== productIds.length) {
      const ok = new Set(activos.map(a => a.id));
      const faltan = productIds.filter(id => !ok.has(id));
      throw new Error(`Producto no existe o inactivo: ${faltan.join(", ")}`);
    }

    // Stocks existentes en el depósito
    const stocks = await tx.stockPorDeposito.findMany({
      where: { depositoId: data.depositoId, productoId: { in: productIds } },
      select: { id: true, productoId: true, stockActual: true },
    });
    const stockMap = new Map(stocks.map(s => [s.productoId, s]));

    // Crear stocks faltantes SOLO si es ingreso
    if (esIngreso) {
      const faltantes = productIds.filter(pid => !stockMap.has(pid));
      if (faltantes.length) {
        const creados = await Promise.all(
          faltantes.map(pid =>
            tx.stockPorDeposito.create({
              data: { depositoId: data.depositoId, productoId: pid, stockActual: 0 },
              select: { id: true, productoId: true, stockActual: true },
            })
          )
        );
        for (const s of creados) stockMap.set(s.productoId, s);
      }
    } else {
      const faltantes = productIds.filter(pid => !stockMap.has(pid));
      if (faltantes.length) throw new Error(`Stock inexistente para producto(s): ${faltantes.join(", ")}`);
    }

    // Actualizaciones atómicas de stock (anti-carrera)
    for (const [productoId, cantidad] of agregados) {
      const s = stockMap.get(productoId)!;
      if (esIngreso) {
        await tx.stockPorDeposito.update({
          where: { id: s.id },
          data: { stockActual: { increment: cantidad } },
        });
      } else {
        const { count } = await tx.stockPorDeposito.updateMany({
          where: { id: s.id, stockActual: { gte: cantidad } },
          data: { stockActual: { decrement: cantidad } },
        });
        if (count === 0) throw new Error(`Stock insuficiente para producto ${productoId}`);
      }
    }

    // Armar detalles (tu DetalleMovimiento requiere conectar 'stock', no pasar FK directo)
    const detallesCreate = data.detalles.map(d => {
      const s = stockMap.get(d.productoId);
      if (!s) throw new Error(`Stock inexistente para producto ${d.productoId}`);
      return { stock: { connect: { id: s.id } }, cantidad: d.cantidad };
    });

    // Crear movimiento + detalles
    const movimiento = await tx.movimientoStock.create({
      data: {
        depositoId: data.depositoId,
        tipoMovimientoId: data.tipoMovimientoId,
        tipoComprobanteId: data.tipoComprobanteId,
        detalles: { create: detallesCreate },
      },
      include: { detalles: true },
    });

    return movimiento;
  }, { isolationLevel: "Serializable" });
}

// Si te resulta más cómodo seguir importando 'createMovimiento':
export { crearMovimiento as createMovimiento };
