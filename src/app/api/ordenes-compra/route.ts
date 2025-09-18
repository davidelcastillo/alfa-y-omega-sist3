import { NextRequest, NextResponse } from 'next/server';
import { getOrdenesCompra } from '@/server/ordenes-compra.service';
import { prisma } from "@/lib/prisma";
import { z } from "zod";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const estado = searchParams.get("estado")
      ? searchParams.get("estado") === "true"
      : undefined;
    const proveedorId = searchParams.get("proveedorId")
      ? Number(searchParams.get("proveedorId"))
      : undefined;
    const depositoId = searchParams.get("depositoId")
      ? Number(searchParams.get("depositoId"))
      : undefined;
    const fecha_desde = searchParams.get("fecha_desde") || undefined;
    const fecha_hasta = searchParams.get("fecha_hasta") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = (searchParams.get("sort") as "asc" | "desc") || "desc";

    const result = await getOrdenesCompra({
      page,
      limit,
      estado,
      proveedorId,
      depositoId,
      fecha_desde,
      fecha_hasta,
      search,
      sort,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET /ordenes-compra:", error);
    return NextResponse.json(
      { message: "Error al obtener órdenes de compra" },
      { status: 500 }
    );
  }
}

// Validaciones de entrada
const ordenCompraSchema = z.object({
  fecha: z.string().transform((val) => new Date(val)), // fecha como string ISO
  hora: z.string().optional(),
  nroOC: z.string().optional(),
  proveedorId: z.number().int().positive(), // FK obligatoria
  subTotal: z.number().optional(),
  otrosGastos: z.number().optional(),
  total: z.number().optional(),
  fechaEntrega: z.string().optional().transform((val) => (val ? new Date(val) : null)),
  depositoId: z.number().int().positive().optional(),
  observaciones: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = ordenCompraSchema.parse(body);

    // Crear la orden de compra
    const nuevaOrden = await prisma.ordenCompra.create({
      data: {
        fecha: data.fecha,
        hora: data.hora ?? null,
        nroOC: data.nroOC ?? null,
        proveedorId: data.proveedorId, // Se asocia automáticamente con el proveedor
        subTotal: data.subTotal ?? 0,
        otrosGastos: data.otrosGastos ?? 0,
        total: data.total ?? 0,
        fechaEntrega: data.fechaEntrega ?? null,
        depositoId: data.depositoId ?? null,
        observaciones: data.observaciones ?? null,
        estado: true, // por defecto activo
      },
      include: {
        proveedor: true, // devuelve los datos del proveedor asociado
      },
    });

    return NextResponse.json(nuevaOrden, { status: 201 });
  } catch (error: any) {
    console.error("Error creando orden de compra:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno al crear la orden de compra" },
      { status: 500 }
    );
  }
}