//src/server/comprobantes-proveedor.service.ts
import { prisma } from "@/lib/prisma";

// DTO esperado (shape plano, coincidiente con route.ts):
// {
//   ordenCompraId: number,
//   proveedorId?: number,
//   depositoId?: number,
//   tipoComprobanteId: number,
//   metodoPagoId?: number | null,
//   tipoMovimientoId?: number | null,
//   fecha: string,
//   hora?: string | null,
//   letra?: string | null,
//   numeroSucursal?: string | null,
//   numero?: string | null,
//   moneda?: string | null,
//   observaciones?: string | null,
//   detalles: Array<{ productoId:number, cantidad:number, precioUnitario:number, descuento?:number|null, observaciones?:string|null }>
// }

export async function crearComprobanteProveedorConMovimiento(data: any) {
  return await prisma.$transaction(async (tx) => {
    //--- 0) Normalizar/convertir los ids numéricos que vienen planos ---
    const NumOrdenCompra = Number(data.ordenCompraId);
    const NumProveedor = Number(data.proveedorId ?? 0);
    const NumTipoComprobante = Number(data.tipoComprobanteId);
    const NumDepositoBody = data.depositoId !== undefined ? Number(data.depositoId) : undefined;
    const NumMetodoPago = data.metodoPagoId !== undefined ? Number(data.metodoPagoId) : undefined;
    const NumTipoMovimientoBody = data.tipoMovimientoId !== undefined ? Number(data.tipoMovimientoId) : undefined;

    //--- 1) Validaciones base: OC, proveedor, tipo de comprobante ---
    const [oc, prov, tipoComp] = await Promise.all([
      tx.ordenCompra.findUnique({
        where: { id: NumOrdenCompra },
        select: { id: true, depositoId: true, proveedorId: true },
      }),
      NumProveedor ? tx.proveedores.findUnique({
        where: { id: NumProveedor },
        select: { id: true, estado: true, nombre: true },
      }) : Promise.resolve(null),
      tx.tipoComprobante.findUnique({
        where: { id: NumTipoComprobante },
        select: { id: true, nombre: true },
      }),
    ]);

    if (!oc) throw new Error("Orden de compra inexistente");
    if (!tipoComp) throw new Error("Tipo de comprobante inexistente");

    //Si proveedorId vino en body, validar; si no, lo tomamos de la OC más adelante.
    if (NumProveedor && !prov) throw new Error("Proveedor inexistente");
    if (prov && !prov.estado) throw new Error("Proveedor inactivo");
    if (prov && oc.proveedorId !== prov.id) throw new Error("La OC no corresponde al proveedor");

   // Depósito a usar: preferimos body, sino la OC
    const depositoId = NumDepositoBody ?? oc.depositoId;
    if (!depositoId) throw new Error("No hay depósito definido (en body ni en la OC)");

    const deposito = await tx.deposito.findUnique({
      where: { id: Number(depositoId) },
      select: { id: true, estado: true, nombre: true },
    });
    if (!deposito) throw new Error("Depósito inexistente");
    if (!deposito.estado) throw new Error("El depósito está inactivo");

    //--- 2) Detalles (deben venir como 'detalles' con productoId/cantidad/precioUnitario) ---
    const detallesInput = data.detalles ?? [];
    if (!Array.isArray(detallesInput) || detallesInput.length === 0) {
      throw new Error("El comprobante no tiene detalles");
    }

   // 2.1) Validar que los productos pertenezcan a la OC y cantidades positivas
    const ocItems = await tx.detalleOrdenCompra.findMany({
      where: { ordenCompraId: NumOrdenCompra },
      select: { productoId: true, precioUnitario: true, cantidad: true },
    });
    const setOc = new Set(ocItems.map((i) => Number(i.productoId)));
    for (const d of detallesInput) {
      const prodId = Number(d.productoId ?? d.productoId);
      const cant = Number(d.cantidad ?? d.cantidad);
      if (!setOc.has(prodId)) throw new Error(`El producto ${prodId} no pertenece a la Orden de Compra`);
      if (!(Number.isFinite(cant) && cant > 0)) throw new Error("Cantidad inválida en detalle");
      if (!Number.isFinite(Number(d.precioUnitario ?? d.precioUnitario))) throw new Error("Precio unitario inválido en detalle");
    }

   // --- 3) Evitar comprobantes duplicados (mismo proveedor, tipo, letra/sucursal/numero) ---
    const proveedorIdToUse = data.proveedorId ?? oc.proveedorId;
    const yaExiste = await tx.comprobanteProveedor.findFirst({
      where: {
        proveedorId: proveedorIdToUse,
        tipoComprobanteId: NumTipoComprobante,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? null,
        numero: data.numero ?? null,
      },
      select: { id: true },
    });
    if (yaExiste) throw new Error("El comprobante ya existe para ese proveedor");

   // --- 4) Calcular montos (descuento en % opcional) ---
    const detallesCalculados = detallesInput.map((d: any) => {
      const descuentoPct = (d.descuento ?? 0) / 100;
      const cantidad = Number(d.cantidad);
      const precioUnit = Number(d.precioUnitario);
      const precioXCantidad = cantidad * precioUnit * (1 - (descuentoPct || 0));
      return {
        productoId: Number(d.productoId),
        cantidad,
        precioUnitario: precioUnit,
        descuento: Number(d.descuento ?? 0),
        observaciones: d.observaciones ?? null,
        precioXCantidad,
      };
    });
    const total = detallesCalculados.reduce((acc, d) => acc + d.precioXCantidad, 0);

   // --- 5) Crear comprobante proveedor ---
    const fecha = new Date(data.fecha);
    const cp = await tx.comprobanteProveedor.create({
      data: {
        ordenCompra: { connect: { id: NumOrdenCompra } },
        proveedor: { connect: { id: proveedorIdToUse } },
        deposito: { connect: { id: Number(depositoId) } },
        tipoComprobante: { connect: { id: NumTipoComprobante } },
        metodoPago: { connect: { id: Number(NumMetodoPago ?? 1) } },

        fecha,
        hora: data.hora ?? null,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? "0001",
        numero: data.numero ?? null,
        observaciones: data.observaciones ?? null,
        total,
        saldo: total,
        moneda: data.moneda ?? "ARS",

        detalleComprobante: {
          create: detallesCalculados.map((d) => ({
            productoId: Number(d.productoId),
            cantidad: Number(d.cantidad),
            precioUnitario: Number(d.precioUnitario),
            descuento: Number(d.descuento ?? 0),
            precioXCantidad: Number(d.precioXCantidad),
            observaciones: d.observaciones ?? null,
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

    --- 6) Prevenir duplicar movimiento (numero virtual) ---
    const numeroMov = `CP-${cp.id}`;
    const movExistente = await tx.movimientoStock.findFirst({
      where: {
        numeroComprobante: numeroMov,
        tipoComprobanteId: cp.tipoComprobanteId,
        depositoId: Number(depositoId),
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

    --- 7) Tipo movimiento: fallback a tipo con saldo=true si no vino ---
    let tipoMovimientoId = NumTipoMovimientoBody ?? null;
    if (!tipoMovimientoId) {
      const tm = await tx.tipoMovimiento.findFirst({
        where: { saldo: true },
        select: { id: true, nombre: true },
        orderBy: { id: "asc" },
      });
      if (!tm) throw new Error("No existe un TipoMovimiento con saldo=true (ingreso)");
      tipoMovimientoId = tm.id;
    }

    --- 8) Crear movimientoStock (entrada) ---
    const mov = await tx.movimientoStock.create({
      data: {
        depositoId: Number(depositoId),
        tipoMovimientoId,
        tipoComprobanteId: cp.tipoComprobanteId,
        numeroComprobante: numeroMov,
        comentario: `ComprobanteProveedor #${cp.id} - Proveedor #${cp.proveedorId} con fecha ${cp.fecha}`,
        fecha,
      },
      select: { id: true, depositoId: true },
    });

    //--- 9) Actualizar stock y crear detalleMovimiento ---
    for (const det of cp.detalleComprobante) {
      const spd = await tx.stockPorDeposito.upsert({
        where: { productoId_depositoId: { productoId: det.productoId, depositoId: Number(depositoId) } },
        create: { productoId: det.productoId, depositoId: Number(depositoId), stockActual: 0 },
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

    //--- 10) Devolver comprobante y movimiento completo ---
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
