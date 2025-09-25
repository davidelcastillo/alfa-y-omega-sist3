// src/app/api/ordenes-compra/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

import { parseSearchParams } from "@/lib/utils";
import {
  OrdenCompraQuerySchema,
  OrdenCompraCreateSchema,
} from "@/lib/compras/types";
import { getOrdenesCompra } from "@/server/ordenes-compra.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // ✅ mismo DTO entre front y back
    const q = parseSearchParams(OrdenCompraQuerySchema, searchParams);

    const result = await getOrdenesCompra(q);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET /ordenes-compra:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Parámetros inválidos", detalles: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error al obtener órdenes de compra" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // ✅ mismo DTO entre front y back
    const body = await req.json();
    const dto = OrdenCompraCreateSchema.parse(body);

    // Checks de FK mínimas (útiles para el front)
    const prov = await prisma.proveedores.findUnique({
      where: { id: dto.proveedorId },
      select: { id: true },
    });
    if (!prov) {
      return NextResponse.json(
        { error: "Proveedor inexistente" },
        { status: 400 }
      );
    }

    if (dto.depositoId) {
      const dep = await prisma.deposito.findUnique({
        where: { id: dto.depositoId },
        select: { id: true },
      });
      if (!dep) {
        return NextResponse.json(
          { error: "Depósito inexistente" },
          { status: 400 }
        );
      }
    }

    // Crear OC
    const nueva = await prisma.ordenCompra.create({
      data: {
        fecha: new Date(dto.fecha),
        hora: dto.hora ?? null,
        nroOC: dto.nroOC ?? null,
        proveedorId: dto.proveedorId,
        subTotal: dto.subTotal ?? 0,
        otrosGastos: dto.otrosGastos ?? 0,
        total: dto.total ?? 0,
        fechaEntrega: dto.fechaEntrega ? new Date(dto.fechaEntrega) : null,
        depositoId: dto.depositoId ?? null,
        observaciones: dto.observaciones ?? null,
        estado: true,
      },
      include: {
        proveedor: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(nueva, { status: 201 });
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
