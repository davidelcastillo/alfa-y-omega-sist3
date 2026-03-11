import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar que el ID sea un número válido
    const comprobanteId = Number(params.id);
    if (isNaN(comprobanteId)) {
      return NextResponse.json(
        { error: "ID de comprobante inválido" },
        { status: 400 }
      );
    }

    // Obtener el comprobante con sus relaciones
    const comprobante = await prisma.comprobanteProveedor.findUnique({
      where: { id: comprobanteId },
      include: {
        ordenCompra: {
          include: {
            detalleOrdenCompra: {
              include: {
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    unidad: {
                      select: {
                        nombre: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        proveedor: {
          select: {
            id: true,
            nombre: true,
            razonSocial: true,
          },
        },
        detalleComprobante: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                unidad: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
        },
        deposito: {
          select: {
            id: true,
            nombre: true,
          },
        },
        tipoComprobante: true,
        metodoPago: true,
      },
    });

    if (!comprobante) {
      return NextResponse.json(
        { error: "Comprobante no encontrado" },
        { status: 404 }
      );
    }

    // Obtener datos auxiliares
    const [tiposComprobante, tiposMovimiento, metodosPago] = await Promise.all([
      prisma.tipoComprobante.findMany({
        select: {
          id: true,
          nombre: true,
        },
      }),
      prisma.tipoMovimiento.findMany({
        select: {
          id: true,
          nombre: true,
          saldo: true,
        },
      }),
      prisma.metodoPago.findMany({
        select: {
          id: true,
          nombre: true,
        },
      }),
    ]);

    // Construir respuesta
    return NextResponse.json({
      data: {
        comprobante,
        opciones: {
          tiposComprobante,
          tiposMovimiento,
          metodosPago,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener comprobante:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}