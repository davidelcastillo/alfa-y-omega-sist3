// src/server/comprobantes-proveedor.service.ts
import { prisma } from "@/lib/prisma";

import { DetalleComprobanteProveedor as DetalleCPDTO,
  ComprobanteProveedor as CrearComprobanteProveedorDTO
        } from "../lib/comprobante-proveedor/comprobante";

// type DetalleCPDTO = {
//   productoId: number;
//   cantidad: number;
//   precioUnitario: number;
//   descuento?: number | null;
//   observaciones?: string | null;
// };

// export type CrearComprobanteProveedorDTO = {
//   ordenCompraId: number;
//   proveedorId: number;
//   tipoComprobanteId: number;
//   fecha: string; // ISO (se parsea a Date)
//   hora?: string | null;
//   letra?: string | null;
//   numeroSucursal?: string | null;
//   numero?: string | null;
//   metodoPagoId?: number | null;
//   observaciones?: string | null;
//   depositoId?: number | null;
//   tipoMovimientoId?: number | null;
//   detalles: DetalleCPDTO[];
// };

export async function crearComprobanteProveedorConMovimiento(
  data: CrearComprobanteProveedorDTO
) {
  return await prisma.$transaction(async (tx) => {
    // Conversiones tipos de datos
    const NumOrdenCompra = Number(data.ordenCompra.id);
    const NumProveedor = Number(data.proveedor.id);
    const NumTipoComprobante = Number(data.tipoComprobante.id);
    const NumDeposito =  Number(data.deposito.id) ;

    // 1) Validaciones base: OC, proveedor, tipo de comprobante
    const [oc, prov, tipoComp] = await Promise.all([
      tx.ordenCompra.findUnique({
        where: { id: NumOrdenCompra },
        select: { id: true, depositoId: true, proveedorId: true },
      }),
      tx.proveedores.findUnique({
        where: { id: NumProveedor },
        select: { id: true, estado: true, nombre: true },
      }),
      tx.tipoComprobante.findUnique({
        where: { id: NumTipoComprobante },
        select: { id: true, nombre: true },
      }),
    ]);

    if (!oc) throw new Error("Orden de compra inexistente");
    if (!prov) throw new Error("Proveedor inexistente");
    if (!prov.estado) throw new Error("Proveedor inactivo");
    if (!tipoComp) throw new Error("Tipo de comprobante inexistente");
    if (oc.proveedorId !== prov.id)
      throw new Error("La OC no corresponde al proveedor");

    // Depósito a usar
    const depositoId = NumDeposito?? oc.depositoId;
    if (!depositoId) throw new Error("No hay depósito definido (en body ni en la OC)");

    const deposito = await tx.deposito.findUnique({
      where: { id: depositoId },
      select: { id: true, estado: true, nombre: true },
    });
    if (!deposito) throw new Error("Depósito inexistente");
    if (!deposito.estado) throw new Error("El depósito está inactivo");

    if (!data.items?.length) throw new Error("El comprobante no tiene detalles");

    // 2) Evitar comprobantes duplicados
    const yaExiste = await tx.comprobanteProveedor.findFirst({
      where: {
        proveedorId: NumProveedor,
        tipoComprobanteId: NumTipoComprobante,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? null,
        numero: data.numero ?? null,
      },
      select: { id: true },
    });
    if (yaExiste) throw new Error("El comprobante ya existe para ese proveedor");

    // 3) Validar items en la OC
    const ocItems = await tx.detalleOrdenCompra.findMany({
      where: { ordenCompraId: NumOrdenCompra },
      select: { productoId: true, precioUnitario: true, cantidad: true },
    });
    const setOc = new Set(ocItems.map((i) => i.productoId));
    for (const d of data.items) {
      if (!setOc.has(Number(d.productId))) {
        throw new Error(`El producto ${d.productId} no pertenece a la Orden de Compra`);
      }
      if (d.quantity <= 0) throw new Error("Cantidad inválida en detalle");
    }

    // 3.1) Calcular montos
    const detallesCalculados = data.items.map((d) => {
      const desc = d.discount ? d.discount / 100 : 0;
      const precioXCantidad = d.quantity * d.unitPrice * (1 - desc);
      return { ...d, precioXCantidad };
    });
    const total = detallesCalculados.reduce((acc, d) => acc + d.precioXCantidad, 0);

    // 3.2) Crear ComprobanteProveedor (conectando la Orden de Compra en vez de pasar ordenCompraId)
    const fecha = new Date(data.fecha);
    const cp = await tx.comprobanteProveedor.create({
      data: {
        ordenCompra: { connect: { id: NumOrdenCompra } },
        proveedor: { connect: { id: NumProveedor } },
        deposito: { connect: { id: NumDeposito } },
        tipoComprobante: { connect: { id: NumTipoComprobante } },
        metodoPago: { connect: { id: Number(data.metodoPago.id ?? 1) } },

        fecha,
        hora: data.hora ?? null,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? "0001",
        numero: data.numero ?? null,
        observaciones: data.observaciones ?? null,
        total,
        saldo: total,
        moneda: "ARS",

        detalleComprobante: {
          create: detallesCalculados.map((d) => ({
            productoId: Number(d.productId),
            cantidad: Number(d.quantity),
            precioUnitario: Number(d.unitPrice),
            descuento: Number(d.discount ?? 0),
            precioXCantidad: Number(d.precioXCantidad),
            observaciones: d.observations ?? null,
          })),
        },
      },
  include: {
    detalleComprobante: {
      select: {
        productoId: true,
        cantidad: true,
      },
    },
  },
});

    // 4) prevenir duplicar movimiento: número virtual
    const numeroMov = `CP-${cp.id}`;

    const movExistente = await tx.movimientoStock.findFirst({
      where: {
        numeroComprobante: numeroMov,
        tipoComprobanteId: cp.tipoComprobanteId,
        depositoId,
      },
      select: { id: true },
    });
    if (movExistente) {
      const mov = await tx.movimientoStock.findUnique({
        where: { id: movExistente.id },
        include: {
          detalles: true,
          tipoMovimiento: true,
          tipoComprobante: true,
          deposito: true,
        },
      });
      return { comprobante: cp, movimiento: mov };
    }

    // 5) tipo de movimiento (entrada) fallback
    let tipoMovimientoId = Number(data.tipoMovimiento.id) ?? null;
    if (!tipoMovimientoId) {
      const tm = await tx.tipoMovimiento.findFirst({
        where: { saldo: true },
        select: { id: true, nombre: true },
        orderBy: { id: "asc" },
      });
      if (!tm) throw new Error("No existe un TipoMovimiento con saldo=true (ingreso)");
      tipoMovimientoId = tm.id;
    }

    // 6) crear movimiento stock (entrada)
    const mov = await tx.movimientoStock.create({
      data: {
        depositoId,
        tipoMovimientoId,
        tipoComprobanteId: cp.tipoComprobanteId,
        numeroComprobante: numeroMov,
        comentario: `ComprobanteProveedor #${cp.id} - Proveedor #${cp.proveedorId} con fecha ${cp.fecha}`,
        fecha,
      },
      select: { id: true, depositoId: true },
    });

    // 7) aplicar stock y crear detalleMovimiento
    for (const det of cp.detalleComprobante) {
      const spd = await tx.stockPorDeposito.upsert({
        where: { productoId_depositoId: { productoId: det.productoId, depositoId } },
        create: { productoId: det.productoId, depositoId, stockActual: 0 },
        update: {},
        select: { id: true, stockActual: true },
      });

      const nuevoStock = spd.stockActual + det.cantidad;
      await tx.stockPorDeposito.update({
        where: { id: spd.id },
        data: { stockActual: nuevoStock },
      });

      await tx.detalleMovimiento.create({
        data: {
          movimientoId: mov.id,
          productoId: det.productoId,
          cantidad: det.cantidad,
        },
      });
    }

    // 8) devolver ambos
    const movCompleto = await tx.movimientoStock.findUnique({
      where: { id: mov.id },
      include: {
        tipoMovimiento: { select: { id: true, nombre: true, saldo: true } },
        tipoComprobante: { select: { id: true, nombre: true } },
        deposito: { select: { id: true, nombre: true } },
        detalles: {
          select: {
            id: true,
            cantidad: true,
            producto: { select: { id: true, nombre: true } },
          },
        },
      },
    });

    return { comprobante: cp, movimiento: movCompleto };
  });
}
