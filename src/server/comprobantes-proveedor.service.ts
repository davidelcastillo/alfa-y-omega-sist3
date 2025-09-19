import { prisma } from '@/lib/prisma';

type DetalleCPDTO = {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento?: number | null;   // %
  observaciones?: string | null;
};

export type CrearComprobanteProveedorDTO = {
  ordenCompraId: number;
  // proveedorId?: number;  // ← se ignora (se toma de la OC)
  // depositoId?: number;   // ← se ignora (se toma de la OC)
  tipoComprobanteId: number;
  fecha: string;               // ISO
  hora?: string | null;
  letra?: string | null;
  numeroSucursal?: string | null;
  numero?: string | null;
  metodoPagoId?: number | null;
  observaciones?: string | null;
  detalles: DetalleCPDTO[];
};

export async function crearComprobanteProveedorConMovimiento(data: CrearComprobanteProveedorDTO) {
  return await prisma.$transaction(async (tx) => {
    // 1) Cargar OC obligatoria y usar su proveedor + depósito
    const oc = await tx.ordenCompra.findUnique({
      where: { id: data.ordenCompraId },
      select: {
        id: true,
        proveedorId: true,
        depositoId: true,
        detalleOrdenCompra: { select: { productoId: true } },
      },
    });
    if (!oc) throw new Error('Orden de compra inexistente');
    if (!oc.depositoId) throw new Error('La Orden de Compra no tiene depósito asignado');

    const proveedor = await tx.proveedores.findUnique({
      where: { id: oc.proveedorId },
      select: { id: true, estado: true },
    });
    if (!proveedor) throw new Error('Proveedor inexistente');
    if (!proveedor.estado) throw new Error('Proveedor inactivo');

    const tipoComp = await tx.tipoComprobante.findUnique({
      where: { id: data.tipoComprobanteId },
      select: { id: true },
    });
    if (!tipoComp) throw new Error('Tipo de comprobante inexistente');

    if (!data.detalles?.length) throw new Error('El comprobante no tiene detalles');

    // 2) Validar que TODOS los productos del body están en la OC
    const productosEnOC = new Set(oc.detalleOrdenCompra.map(it => it.productoId));
    for (const d of data.detalles) {
      if (!productosEnOC.has(d.productoId)) {
        throw new Error(`El producto ${d.productoId} no pertenece a la Orden de Compra`);
      }
      if (d.cantidad <= 0) throw new Error('Cantidad inválida en detalle');
      if (d.precioUnitario <= 0) throw new Error('Precio unitario inválido en detalle');
    }

    // 3) Evitar CP duplicado (mismo prov + tipo + letra/sucursal/numero)
    const yaExiste = await tx.comprobanteProveedor.findFirst({
      where: {
        proveedorId: oc.proveedorId,
        tipoComprobanteId: data.tipoComprobanteId,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? null,
        numero: data.numero ?? null,
      },
      select: { id: true },
    });
    if (yaExiste) throw new Error('El comprobante ya existe para ese proveedor');

    // 4) Calcular precioXCantidad + total/saldo
    const detallesCalc = data.detalles.map(d => {
      const desc = d.descuento ? d.descuento / 100 : 0;
      const precioXCantidad = d.cantidad * d.precioUnitario * (1 - desc);
      return { ...d, precioXCantidad };
    });
    const total = detallesCalc.reduce((acc, d) => acc + d.precioXCantidad, 0);

    const fecha = new Date(data.fecha);

    // 5) Crear CP usando proveedor/deposito de la OC
    const cp = await tx.comprobanteProveedor.create({
      data: {
        ordenCompraId: oc.id,
        proveedorId: oc.proveedorId,           // ← fijo por OC
        tipoComprobanteId: data.tipoComprobanteId,
        fecha,
        hora: data.hora ?? null,
        letra: data.letra ?? null,
        numeroSucursal: data.numeroSucursal ?? null,
        numero: data.numero ?? null,
        metodoPagoId: data.metodoPagoId ?? null,
        observaciones: data.observaciones ?? null,
        total,
        saldo: total,                          // saldo inicial = total
        detalleComprobante: {
          create: detallesCalc.map(d => ({
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            descuento: d.descuento ?? null,
            precioXCantidad: d.precioXCantidad,
            observaciones: d.observaciones ?? null,
          })),
        },
      },
      include: {
        detalleComprobante: { select: { productoId: true, cantidad: true } },
      },
    });

    // 6) Idempotencia del movimiento: numeroComprobante "CP-<id>"
    const numeroMov = `CP-${cp.id}`;
    const yaMov = await tx.movimientoStock.findFirst({
      where: {
        numeroComprobante: numeroMov,
        tipoComprobanteId: cp.tipoComprobanteId,
        depositoId: oc.depositoId!,
      },
      select: { id: true },
    });
    if (yaMov) {
      const mov = await tx.movimientoStock.findUnique({
        where: { id: yaMov.id },
        include: { detalles: true, tipoMovimiento: true, tipoComprobante: true, deposito: true },
      });
      return { comprobante: cp, movimiento: mov };
    }

    // 7) TipoMovimiento de ENTRADA (saldo=true)
    const tmIngreso = await tx.tipoMovimiento.findFirst({
      where: { saldo: true },
      select: { id: true, nombre: true },
      orderBy: { id: 'asc' },
    });
    if (!tmIngreso) throw new Error('No existe un TipoMovimiento con saldo=true (ingreso)');

    // 8) Crear movimiento en el depósito de la OC y actualizar stock
    const mov = await tx.movimientoStock.create({
      data: {
        depositoId: oc.depositoId!,                 // ← fijo por OC
        tipoMovimientoId: tmIngreso.id,
        tipoComprobanteId: cp.tipoComprobanteId,
        numeroComprobante: numeroMov,
        Comentario: `ComprobanteProveedor #${cp.id} - Proveedor #${oc.proveedorId}`, // usa "Comentario" según tu client actual
        fecha,
      },
      select: { id: true, depositoId: true },
    });

    for (const det of cp.detalleComprobante) {
      const spd = await tx.stockPorDeposito.upsert({
        where: { productoId_depositoId: { productoId: det.productoId, depositoId: oc.depositoId! } },
        create: { productoId: det.productoId, depositoId: oc.depositoId!, stockActual: 0 },
        update: {},
        select: { id: true, stockActual: true },
      });

      await tx.stockPorDeposito.update({
        where: { id: spd.id },
        data: { stockActual: spd.stockActual + det.cantidad }, // ingreso
      });

      await tx.detalleMovimiento.create({
        data: { movimientoId: mov.id, productoId: det.productoId, cantidad: det.cantidad },
      });
    }

    const movCompleto = await tx.movimientoStock.findUnique({
      where: { id: mov.id },
      include: {
        tipoMovimiento: { select: { id: true, nombre: true, saldo: true } },
        tipoComprobante: { select: { id: true, nombre: true } },
        deposito: { select: { id: true, nombre: true } },
        detalles: {
          select: { id: true, cantidad: true, producto: { select: { id: true, nombre: true } } },
        },
      },
    });

    return { comprobante: cp, movimiento: movCompleto };
  });
}
