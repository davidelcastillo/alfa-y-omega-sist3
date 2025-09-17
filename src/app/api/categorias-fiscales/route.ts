import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.categoriaFiscal.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    })
    return NextResponse.json({ ok: true, data }, { status: 200 })
  } catch (err) {
    console.error('[GET /api/categorias-fiscales]', err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}

// cache opcional (1 hora)
export const revalidate = 3600
