import { prisma } from "@/lib/prisma";
import { OrdenPagoCreateDTO } from "@/lib/ordenes-pago/types";

export async function crearOrdenPago(data: OrdenPagoCreateDTO) {
  return await prisma.$transaction(async (tx) => {
    // 1) Proveedor y método de pago válidos
    const proveedor = await tx.proveedores.findUnique({
      where: { id: data.proveedorId }, select: { id: true, estado: true }
    });
    if (!proveedor) throw new Error("Proveedor inexistente");
    if (!proveedor.estado) throw new Error("Proveedor inactivo");

    const metodo = await tx.metodoPago.findUnique({
      where: { id: data.metodoPagoId }, select: { id: true }
    });
    if (!metodo) throw new Error("Método de pago inexistente");

    // 2) Traer comprobantes involucrados y validar saldos
    const ids = Array.from(new Set(data.detalles.map(d => Number(d.comprobanteId))));
    const comprobantes = await tx.comprobanteProveedor.findMany({
      where: { id: { in: ids } },
      select: { id: true, proveedorId: true, saldo: true, estado: true }
    });
    if (comprobantes.length !== ids.length) {
      throw new Error("Uno o más comprobantes no existen");
    }
    // todos del mismo proveedor
    if (comprobantes.some(c => c.proveedorId !== data.proveedorId)) {
      throw new Error("Hay comprobantes de otro proveedor");
    }
    // saldos > 0 y montos no exceden
    const byId = new Map(comprobantes.map(c => [c.id, c]));
    for (const d of data.detalles) {
      const c = byId.get(Number(d.comprobanteId))!;
      const saldoPrevio = Number(c.saldo ?? 0);
      if (saldoPrevio <= 0) throw new Error(`El comprobante ${c.id} no tiene saldo`);
      if (d.montoPagado > saldoPrevio) {
        throw new Error(`El pago (${d.montoPagado}) excede el saldo del comprobante ${c.id} (${saldoPrevio})`);
      }
    }

    // 3) Crear Orden de Pago
    const fecha = new Date(data.fecha);
    const totalPagado = data.detalles.reduce((a, d) => a + Number(d.montoPagado), 0);

    const op = await tx.ordenPago.create({
      data: {
        proveedorId: data.proveedorId,
        fecha,
        nroInterno: data.nroInterno ?? null,
        metodoPagoId: data.metodoPagoId,
        observaciones: data.observaciones ?? null,
        totalPagado,
        estado: true,
      },
      select: { id: true, proveedorId: true, fecha: true, nroInterno: true, metodoPagoId: true, totalPagado: true }
    });

    // 4) Crear detalles y actualizar saldos de comprobantes
    const detallesOut: Array<{ comprobanteId:number, montoPagado:number, saldoPrevio:number|null, saldoRestante:number|null }> = [];
    for (const d of data.detalles) {
      const comp = byId.get(Number(d.comprobanteId))!;
      const saldoPrevio = Number(comp.saldo ?? 0);
      const saldoRestante = Math.max(0, saldoPrevio - Number(d.montoPagado));

      await tx.detalleOrdenPago.create({
        data: {
          ordenPagoId: op.id,
          comprobanteId: comp.id,
          montoPagado: Number(d.montoPagado),
          saldoPrevio, saldoRestante,
        }
      });

      await tx.comprobanteProveedor.update({
        where: { id: comp.id },
        data: { saldo: saldoRestante }
      });

      detallesOut.push({
        comprobanteId: comp.id,
        montoPagado: Number(d.montoPagado),
        saldoPrevio, saldoRestante
      });
    }

    return { ordenPago: op, detalles: detallesOut };
  });
}
