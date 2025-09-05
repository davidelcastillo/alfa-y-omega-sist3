// src/app/api/productos/catalogos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// lo que realiza las consultas a la base de datos para los catálogos
// rubros, marcas, unidades los trae para que los muestre en el formulario del frontend
// y el usuario pueda seleccionar de un listado desplegable
export async function GET() {
try {
    const [rubros, marcas, unidades] = await Promise.all([
    prisma.rubro.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'asc' } }),
    prisma.marca.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'asc' } }),
    prisma.unidad.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: 'asc' } }),
    ]);

    return NextResponse.json({ ok: true, data: { rubros, marcas, unidades } });
} catch (err) {
    console.error('[GET /api/productos/catalogos]', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
}
}
