import { prisma } from "@/lib/prisma";
import { OrdenPagoCreateDTO } from "@/lib/ordenes-pago/types";

export async function crearOrdenPago(data: OrdenPagoCreateDTO) {
  return await prisma.$transaction(async (tx) => {
    // 1) Validaciones cabecera
    const proveedor = await tx.proveedores.findUnique({
      where: { id: data.proveedorId }, select: { id: true, estado: true }
    });
    if (!proveedor) throw new Error("Proveedor inexistente");
    if (!proveedor.estado) throw new Error("Proveedor inactivo");

    const metodo = await tx.metodoPago.findUnique({
      where: { id: data.metodoPagoId }, select: { id: true }
    });
    if (!metodo) throw new Error("Método de pago inexistente");

    // 2) Normalizar y validar detalles
    if (data.detalles.length === 0) throw new Error("Debe incluir al menos un detalle");

    // (2.a) agrupar por comprobante por si repiten renglones
    const montosPorId = new Map<number, number>();
    for (const d of data.detalles) {
      const id = Number(d.comprobanteId);
      const monto = Number(d.montoPagado);
      if (!Number.isFinite(id) || id <= 0) throw new Error("comprobanteId inválido");
      if (!Number.isFinite(monto) || monto <= 0) throw new Error("montoPagado debe ser > 0");
      montosPorId.set(id, (montosPorId.get(id) ?? 0) + monto);
    }

    // (2.b) traer comprobantes y validar proveedor/estado
    const ids = [...montosPorId.keys()];
    const comprobantes = await tx.comprobanteProveedor.findMany({
      where: { id: { in: ids } },
      select: { id: true, proveedorId: true, saldo: true, estado: true }
    });
    if (comprobantes.length !== ids.length) {
      const found = new Set(comprobantes.map(c => c.id));
      const missing = ids.filter(id => !found.has(id));
      throw new Error(`Comprobante(s) inexistente(s): ${missing.join(', ')}`);
    }
    if (comprobantes.some(c => c.proveedorId !== data.proveedorId)) {
      throw new Error("Hay comprobantes de otro proveedor");
    }
    if (comprobantes.some(c => !c.estado)) {
      throw new Error("Hay comprobantes anulados/inactivos");
    }
    // (2.c) validar que la suma a pagar por comprobante no supere su saldo actual
    for (const c of comprobantes) {
      const aPagar = montosPorId.get(c.id)!;
      const saldo = Number(c.saldo ?? 0);
      if (saldo <= 0) throw new Error(`El comprobante ${c.id} no tiene saldo`);
      if (aPagar > saldo) throw new Error(`El pago (${aPagar}) excede el saldo del comprobante ${c.id} (${saldo})`);
    }

    // 3) Crear OP
    const fecha = new Date(data.fecha);
    const totalPagado = [...montosPorId.values()].reduce((a, n) => a + n, 0);

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

    // 4) Aplicar pagos y recalcular saldos (ATÓMICO)
    const detallesOut: Array<{ comprobanteId:number, montoPagado:number, saldoPrevio:number, saldoRestante:number }> = [];

    for (const c of comprobantes) {
      const monto = montosPorId.get(c.id)!;           // suma a pagar para este comprobante
      const saldoPrevio = Number(c.saldo ?? 0);
      const saldoRestanteEsperado = saldoPrevio - monto; // validado arriba que >= 0

      // 🔒 update atómico con condición: saldo >= monto
      const res = await tx.comprobanteProveedor.updateMany({
        where: { id: c.id, proveedorId: data.proveedorId, estado: true, saldo: { gte: monto } },
        data:  { saldo: { decrement: monto } },
      });
      if (res.count !== 1) {
        // alguien cambió el saldo entre la lectura y este update
        throw new Error(`Saldo insuficiente o modificado para comprobante ${c.id}`);
      }

      await tx.detalleOrdenPago.create({
        data: {
          ordenPagoId: op.id,
          comprobanteId: c.id,
          montoPagado: monto,
          saldoPrevio,
          saldoRestante: saldoRestanteEsperado,
        }
      });

      detallesOut.push({
        comprobanteId: c.id,
        montoPagado: monto,
        saldoPrevio,
        saldoRestante: saldoRestanteEsperado,
      });
    }

    return { ordenPago: op, detalles: detallesOut };
  });
}
