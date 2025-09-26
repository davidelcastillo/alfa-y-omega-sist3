//src/app/api/comprobantes-proveedor/nuevo/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { ComprobanteInitQuerySchema, ComprobanteCreateSchema } from "@/lib/comprobante-proveedor/types";
import { CreateSchema } from "@/server/comprobantes-proveedor.service";
import type { ZodError } from "zod";
import { crearComprobanteProveedorConMovimiento } from "@/server/comprobantes-proveedor.service";

interface DetalleOrdenCompra {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  producto: {
    nombre: string;
    unidad: {
      nombre: string;
    };
  };
}

interface ComprobanteInitResponse {
  ok: boolean;
  data: {
    ordenesCompra: Array<{
      id: number;
      nro: string | null;
      fecha: string;
      proveedor: { id: number; nombre: string; }
    }>;
    opciones: {
      tiposComprobante: Array<{ id: number; nombre: string }>;
      metodosPago: Array<{ id: number; nombre: string }>;
    };
    oc?: {
      id: number;
      nro: string | null;
      fecha: string;
      proveedor: { id: number; nombre: string };
      deposito: { id: number; nombre: string } | null;
      items: Array<{
        productoId: number;
        producto: string;
        unidad: string;
        cantidad: number;
        precioUnitario: number;
      }>;
    };
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ordenCompraId = searchParams.get('ordenCompraId');

    // Obtener datos necesarios en paralelo
    const [ordenesCompra, tiposComprobante, metodosPago] = await Promise.all([
      prisma.ordenCompra.findMany({
        where: ordenCompraId ? { id: Number(ordenCompraId) } : undefined,
        select: {
          id: true,
          nroOC: true,
          fecha: true,
          depositoId: true,
          proveedor: {
            select: { id: true, nombre: true }
          },
          detalleOrdenCompra: ordenCompraId ? {
            include: {
              producto: {
                include: {
                  unidad: true
                }
              }
            }
          } : false
        },
        orderBy: { fecha: 'desc' }
      }),
      prisma.tipoComprobante.findMany({
        select: { id: true, nombre: true }
      }),
      prisma.metodoPago.findMany({
        select: { id: true, nombre: true }
      })
    ]);

    // Transformar datos para el formato esperado
    const response: ComprobanteInitResponse = {
      ok: true,
      data: {
        ordenesCompra: ordenesCompra.map(oc => ({
          id: oc.id,
          nro: oc.nroOC,
          fecha: oc.fecha.toISOString(),
          proveedor: oc.proveedor
        })),
        opciones: {
          tiposComprobante,
          metodosPago
        }
      }
    };

    // Si se solicitó una OC específica, incluir sus detalles
    if (ordenCompraId && ordenesCompra.length === 1) {
      const oc = ordenesCompra[0];
      const ocData = {
        id: oc.id,
        nro: oc.nroOC,
        fecha: oc.fecha.toISOString(),
        proveedor: {
          id: oc.proveedor.id,
          nombre: oc.proveedor.nombre
        },
        deposito: oc.depositoId ? {
          id: oc.depositoId,
          nombre: "Depósito Principal"
        } : null,
        items: (oc.detalleOrdenCompra as unknown as DetalleOrdenCompra[]).map(det => ({
          productoId: det.productoId,
          producto: det.producto.nombre,
          unidad: det.producto.unidad.nombre,
          cantidad: det.cantidad,
          precioUnitario: det.precioUnitario
        }))
      };
      response.data = { ...response.data, oc: ocData };
    }

    return Response.json(response);

  } catch (error) {
    console.error('Error en GET /api/comprobantes-proveedor/nuevo:', error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    
    interface RawBody {
      ordenCompraId: string | number;
      proveedorId: string | number;
      tipoComprobanteId: string | number;
      depositoId: string | number;
      fecha: string;
      hora?: string;
      letra?: string;
      numeroSucursal?: string;
      numero?: string;
      metodoPagoId?: string | number;
      observaciones?: string;
      detalles: Array<{
        productoId: string | number;
        cantidad: string | number;
        precioUnitario: string | number;
        descuento?: string | number;
        observaciones?: string;
      }>;
    }

    const input = rawBody as RawBody;
    
    // Validar el payload con el schema y transformar
    // Los datos ya deberían venir en el formato correcto desde el frontend
    const transformedData = {
      ordenCompra: input.ordenCompra,
      proveedor: input.proveedor,
      tipoComprobante: input.tipoComprobante,
      deposito: input.deposito,
      fecha: input.fecha,
      hora: input.hora,
      letra: input.letra,
      numeroSucursal: input.numeroSucursal,
      numero: input.numero,
      metodoPago: input.metodoPago,
      observaciones: input.observaciones,
      tipoMovimiento: input.tipoMovimiento,
      items: input.items
    };

    // Validar con el schema final
    const validatedData = ComprobanteCreateSchema.parse(transformedData);

    // Crear comprobante y movimiento con datos validados
    const result = await crearComprobanteProveedorConMovimiento(validatedData);

    return Response.json({ ok: true, data: result });

  } catch (error: Error | ZodError | unknown) {
    console.error('Error en POST /api/comprobantes-proveedor/nuevo:', error);
    return Response.json(
      { 
        ok: false,
        error: error instanceof Error ? error.message : "Error interno del servidor"
      },
      { status: 500 }
    );
  }
}
