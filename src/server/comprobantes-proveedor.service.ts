// src/server/comprobantes-proveedor.service.ts
import { prisma } from "@/lib/prisma";
import { 
  ComprobanteInitResponse, 
  ComprobanteListResponse, 
  ComprobanteListItem,
  ComprobanteCreateDTO
} from "@/lib/comprobante-proveedor/types";
import { ISODateString } from "@/lib/types";
import { z } from "zod";

// Schemas de validación
const DetalleSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().min(0).max(100).optional().nullable(),
  observations: z.string().optional().nullable()
});

const CreateSchema = z.object({
  ordenCompra: z.object({ id: z.number().positive() }),
  proveedor: z.object({ id: z.number().positive() }),
  tipoComprobante: z.object({ id: z.number().positive() }),
  fecha: ISODateString,
  hora: z.string().nullable().optional(),
  letra: z.string().nullable().optional(),
  numeroSucursal: z.string().nullable().optional(),
  numero: z.string().nullable().optional(),
  metodoPago: z.object({ id: z.number().positive() }).nullable().optional(),
  observaciones: z.string().nullable().optional(),
  deposito: z.object({ id: z.number().positive() }),
  tipoMovimiento: z.object({ id: z.number().positive() }).nullable().optional(),
  items: z.array(DetalleSchema).min(1)
});

export type DetalleCPDTO = z.infer<typeof DetalleSchema>;
export type CrearComprobanteProveedorDTO = z.infer<typeof CreateSchema>;

export async function crearComprobanteProveedorConMovimiento(
  data: CrearComprobanteProveedorDTO
) {
  // Validar payload
  const validated = CreateSchema.parse(data);

  return await prisma.$transaction(async (tx) => {
    // Conversiones tipos de datos
    const NumOrdenCompra = Number(validated.ordenCompra.id);
    const NumProveedor = Number(validated.proveedor.id);
    const NumTipoComprobante = Number(validated.tipoComprobante.id);
    const NumDeposito = Number(validated.deposito.id);

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

    if (!oc) throw new Error("Orden de compra no encontrada");
    if (!prov) throw new Error("Proveedor no encontrado");
    if (!prov.estado) throw new Error("Proveedor inactivo");
    if (!tipoComp) throw new Error("Tipo de comprobante no encontrado");
    if (oc.proveedorId !== prov.id) 
      throw new Error("El proveedor no corresponde a la orden de compra");

    // Depósito a usar
    const depositoId = NumDeposito ?? oc.depositoId;
    if (!depositoId) throw new Error("Depósito no especificado");

    const deposito = await tx.deposito.findUnique({
      where: { id: depositoId },
      select: { id: true, estado: true, nombre: true },
    });
    
    if (!deposito) throw new Error("Depósito no encontrado");
    if (!deposito.estado) throw new Error("Depósito inactivo");

    // 2) Evitar comprobantes duplicados
    const yaExiste = await tx.comprobanteProveedor.findFirst({
      where: {
        proveedorId: NumProveedor,
        tipoComprobanteId: NumTipoComprobante,
        letra: validated.letra ?? null,
        numeroSucursal: validated.numeroSucursal ?? null,
        numero: validated.numero ?? null,
      },
      select: { id: true },
    });
    
    if (yaExiste) 
      throw new Error("El comprobante ya existe para ese proveedor");

    // 3) Validar items en la OC
    const ocItems = await tx.detalleOrdenCompra.findMany({
      where: { ordenCompraId: NumOrdenCompra },
      select: { productoId: true, precioUnitario: true, cantidad: true },
    });

    const setOc = new Set(ocItems.map((i) => i.productoId));
    
    for (const item of validated.items) {
      if (!setOc.has(Number(item.productId))) {
        throw new Error(`El producto ${item.productId} no pertenece a la Orden de Compra`);
      }
      if (item.quantity <= 0) throw new Error("Cantidad inválida en detalle");
    }

    // 3.1) Calcular montos
    const detallesCalculados = validated.items.map((item) => {
      const desc = item.discount ? item.discount / 100 : 0;
      const precioXCantidad = item.quantity * item.unitPrice * (1 - desc);
      return { ...item, precioXCantidad };
    });

    const total = detallesCalculados.reduce((acc, d) => acc + d.precioXCantidad, 0);

    // 3.2) Crear ComprobanteProveedor
    const fecha = new Date(validated.fecha);
    const cp = await tx.comprobanteProveedor.create({
      data: {
        ordenCompra: { connect: { id: NumOrdenCompra } },
        proveedor: { connect: { id: NumProveedor } },
        deposito: { connect: { id: NumDeposito } },
        tipoComprobante: { connect: { id: NumTipoComprobante } },
        metodoPago: validated.metodoPago 
          ? { connect: { id: Number(validated.metodoPago.id) } }
          : undefined,

        fecha,
        hora: validated.hora ?? null,
        letra: validated.letra ?? null,
        numeroSucursal: validated.numeroSucursal ?? "0001",
        numero: validated.numero ?? null,
        observaciones: validated.observaciones ?? null,
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

    // 4) Prevenir duplicar movimiento
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

    // 5) Tipo de movimiento (entrada) fallback
    let tipoMovimientoId = validated.tipoMovimiento?.id;
    if (!tipoMovimientoId) {
      const tm = await tx.tipoMovimiento.findFirst({
        where: { saldo: true },
        select: { id: true, nombre: true },
        orderBy: { id: "asc" },
      });
      if (!tm) throw new Error("No existe un TipoMovimiento con saldo=true (ingreso)");
      tipoMovimientoId = tm.id;
    }

    // 6) Crear movimiento stock
    const mov = await tx.movimientoStock.create({
      data: {
        depositoId,
        tipoMovimientoId,
        tipoComprobanteId: cp.tipoComprobanteId,
        numeroComprobante: numeroMov,
        comentario: `ComprobanteProveedor #${cp.id} - Proveedor #${cp.proveedorId} con fecha ${cp.fecha}`,
        fecha,
      },
    });

    // 7) Aplicar stock y crear detalleMovimiento
    await Promise.all(cp.detalleComprobante.map(async (det) => {
      const spd = await tx.stockPorDeposito.upsert({
        where: { 
          productoId_depositoId: { 
            productoId: det.productoId, 
            depositoId 
          }
        },
        create: { 
          productoId: det.productoId, 
          depositoId, 
          stockActual: det.cantidad 
        },
        update: { 
          stockActual: { increment: det.cantidad } 
        },
      });

      return tx.detalleMovimiento.create({
        data: {
          movimientoId: mov.id,
          productoId: det.productoId,
          cantidad: det.cantidad,
        },
      });
    }));

    // 8) Retornar resultado completo
    const movCompleto = await tx.movimientoStock.findUnique({
      where: { id: mov.id },
      include: {
        tipoMovimiento: { 
          select: { 
            id: true, 
            nombre: true, 
            saldo: true 
          } 
        },
        tipoComprobante: { 
          select: { 
            id: true, 
            nombre: true 
          } 
        },
        deposito: { 
          select: { 
            id: true, 
            nombre: true 
          } 
        },
        detalles: {
          select: {
            id: true,
            cantidad: true,
            producto: { 
              select: { 
                id: true, 
                nombre: true 
              } 
            },
          },
        },
      },
    });

    return { 
      comprobante: cp, 
      movimiento: movCompleto 
    };
  });
}
