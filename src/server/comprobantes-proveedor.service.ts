// src/server/comprobantes-proveedor.service.ts
import { prisma } from "@/lib/prisma";

type DetalleCPDTO = {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  observaciones?: string | null;
};

export type CrearComprobanteProveedorDTO = {
  ordenCompraId: number;
  proveedorId: number;
  tipoComprobanteId: number;
  fecha: string; // ISO (se parsea a Date)
  hora?: string | null;
  letra?: string | null;
  numeroSucursal?: string | null;
  numero?: string | null;
  metodoPagoId?: number | null;
  observaciones?: string | null;
  depositoId?: number | null; // si no viene, se usa el de la OC
  tipoMovimientoId?: number | null; // si no viene, se busca uno con saldo=true
  detalles: DetalleCPDTO[];
};

export async function crearComprobanteProveedorConMovimiento(
  data: CrearComprobanteProveedorDTO
) {
  return await prisma.$transaction(async (tx) => {
    // 1) Validaciones base: OC, proveedor, tipo de comprobante
    const [oc, prov, tipoComp] = await Promise.all([
      tx.ordenCompra.findUnique({
        where: { id: data.ordenCompraId },
        select: { id: true, depositoId: true, proveedorId: true },
      }),
      tx.proveedores.findUnique({
        where: { id: data.proveedorId },
        select: { id: true, estado: true, nombre: true },
      }),
      tx.tipoComprobante.findUnique({
        where: { id: data.tipoComprobanteId },
        select: { id: true, nombre: true },
      }),
    ]);

    if (!oc) throw new Error("Orden de compra inexistente");
    if (!prov) throw new Error("Proveedor inexistente");
    if (!prov.estado) throw new Error("Proveedor inactivo");
    if (!tipoComp) throw new Error("Tipo de comprobante inexistente");
    if (oc.proveedorId !== prov.id)
      throw new Error("La OC no corresponde al proveedor");

    // Depósito a usar: body.depositoId > OC.depositoId
    const depositoId = data.depositoId ?? oc.depositoId;
    if (!depositoId)
      throw new Error("No hay depósito definido (en body ni en la OC)");

    const deposito = await tx.deposito.findUnique({
      where: { id: depositoId },
      select: { id: true, estado: true, nombre: true },
    });
    if (!deposito) throw new Error("Depósito inexistente");
    if (!deposito.estado) throw new Error("El depósito está inactivo");

    if (!data.detalles?.length)
      throw new Error("El comprobante no tiene detalles");

    // 2) Evitar comprobantes duplicados (mismo prov + tipo + letra/sucursal/numero)
    //    (Si tu DB no tiene UNIQUE, al menos chequeamos por app)
    const yaExiste = await tx.comprobanteProveedor.findFirst({
      where: {
        proveedorId: data.proveedorId,
        tipoComprobanteId: data.tipoComprobanteId,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? null,
        numero: data.numero ?? null,
      },
      select: { id: true },
    });
    if (yaExiste)
      throw new Error("El comprobante ya existe para ese proveedor");

    // 3) Crear ComprobanteProveedor + detalles
    const fecha = new Date(data.fecha);
    const cp = await tx.comprobanteProveedor.create({
      data: {
        ordenCompraId: data.ordenCompraId,
        proveedorId: data.proveedorId,
        tipoComprobanteId: data.tipoComprobanteId,
        fecha,
        hora: data.hora ?? null,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? null,
        numero: data.numero ?? null,
        metodoPagoId: data.metodoPagoId ?? null,
        observaciones: data.observaciones ?? null,
        // total/saldo se podrían calcular luego; acá dejamos nulos si no se envían
        detalleComprobante: {
          create: data.detalles.map((d) => ({
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            observaciones: d.observaciones ?? null,
          })),
        },
      },
      include: {
        detalleComprobante: { select: { productoId: true, cantidad: true } },
      },
    });

    // 4) Evitar duplicar el movimiento: usaremos un número "virtual"
    //    único basado en el id del comprobante
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
      // Ya estaba creado el movimiento para este CP
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

    // 5) Tipo de movimiento (entrada): id provisto o el primero con saldo=true
    let tipoMovimientoId = data.tipoMovimientoId ?? null;
    if (!tipoMovimientoId) {
      const tm = await tx.tipoMovimiento.findFirst({
        where: { saldo: true },
        select: { id: true, nombre: true },
        orderBy: { id: "asc" },
      });
      if (!tm)
        throw new Error("No existe un TipoMovimiento con saldo=true (ingreso)");
      tipoMovimientoId = tm.id;
    }

    // 6) Crear MovimientoStock de ENTRADA
    const mov = await tx.movimientoStock.create({
      data: {
        depositoId,
        tipoMovimientoId,
        tipoComprobanteId: cp.tipoComprobanteId,
        numeroComprobante: numeroMov, // vínculo estable con el comprobante
        Comentario: `ComprobanteProveedor #${cp.id} - Proveedor #${cp.proveedorId}`, // campo prisma "comentario"
        fecha, // si querés usar la misma fecha del comprobante
      },
      select: { id: true, depositoId: true },
    });

    // 7) Aplicar stock y crear detalles del movimiento
    for (const det of cp.detalleComprobante) {
      // upsert de stock por (producto, depósito)
      const spd = await tx.stockPorDeposito.upsert({
        where: {
          productoId_depositoId: { productoId: det.productoId, depositoId },
        },
        create: { productoId: det.productoId, depositoId, stockActual: 0 },
        update: {},
        select: { id: true, stockActual: true },
      });

      const nuevoStock = spd.stockActual + det.cantidad; // ingreso
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

    // 8) Devolver ambos
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
