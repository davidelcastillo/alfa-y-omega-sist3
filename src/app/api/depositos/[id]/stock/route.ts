import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { stockQuerySchema } from './schema';

// Tipo de fila del listado de stock
type Row = {
  stockId: number;
  productoId: number;
  producto: string;
  descripcion: string | null;
  rubro: string | null;
  marca: string | null;
  unidad: string | null;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number | null;
  level: 'OK' | 'BELOW_MIN' | 'AT_ZERO' | 'OVER_MAX';
};

export async function GET(req: Request, { params }: { params: { id: string } }) {
  // 1) validar depósito
  const depositId = Number(params.id);
  if (!Number.isInteger(depositId) || depositId <= 0) {
    return NextResponse.json({ ok: false, error: 'Bad deposit id' }, { status: 400 });
  }

  // 2) leer y validar query
  const qp = stockQuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams));
  const skip = (qp.page - 1) * qp.pageSize;
  const take = qp.pageSize;

  // 3) orden seguro (whitelist)
  const sortMap: Record<typeof qp.sort, string> = {
    nombre: 'p."nombre"',
    stock: 'spd."stockActual"',
    rubro: 'r."nombre"',
    marca: 'm."nombre"',
    unidad: 'u."nombre"',
  };
  const orderSql = `${sortMap[qp.sort]} ${qp.dir.toUpperCase()}`;

  // 4) regla de niveles
  const levelCase = Prisma.sql`
    CASE
      WHEN spd."stockActual" = 0 THEN 'AT_ZERO'
      WHEN spd."stockMaximo" IS NOT NULL AND spd."stockActual" > spd."stockMaximo" THEN 'OVER_MAX'
      WHEN spd."stockActual" <= spd."stockMinimo" THEN 'BELOW_MIN'
      ELSE 'OK'
    END
  `;

  const textQ = qp.q ? `%${qp.q.toLowerCase()}%` : null;

  // 5) summary (una sola pasada)
  const summary = await prisma.$queryRaw<{
    total: number; totalUnits: number; ok: number; below: number; zero: number; over: number;
  }[]>`
    WITH base AS (
      SELECT ${levelCase} AS level, spd."stockActual"
      FROM "StockPorDeposito" spd
      JOIN "Producto" p ON p.id = spd."productoId"
      LEFT JOIN "Rubro" r ON r.id = p."rubroId"
      LEFT JOIN "Marca" m ON m.id = p."marcaId"
      LEFT JOIN "Unidad" u ON u.id = p."unidadId"
      WHERE spd."depositoId" = ${depositId}
        ${textQ ? Prisma.sql`AND (
          LOWER(p."nombre") LIKE ${textQ} OR LOWER(COALESCE(p."descripcion", '')) LIKE ${textQ} OR
          LOWER(COALESCE(r."nombre", '')) LIKE ${textQ} OR
          LOWER(COALESCE(m."nombre", '')) LIKE ${textQ} OR
          LOWER(COALESCE(u."nombre", '')) LIKE ${textQ}
        )` : Prisma.empty}
    )
    SELECT
      COUNT(*)::int AS total,
      COALESCE(SUM("stockActual"),0)::int AS "totalUnits",
      COALESCE(SUM(CASE WHEN level='OK' THEN 1 ELSE 0 END),0)::int AS ok,
      COALESCE(SUM(CASE WHEN level='BELOW_MIN' THEN 1 ELSE 0 END),0)::int AS below,
      COALESCE(SUM(CASE WHEN level='AT_ZERO' THEN 1 ELSE 0 END),0)::int AS zero,
      COALESCE(SUM(CASE WHEN level='OVER_MAX' THEN 1 ELSE 0 END),0)::int AS over
    FROM base;
  `;
  const S = summary[0] || { total: 0, totalUnits: 0, ok: 0, below: 0, zero: 0, over: 0 };

  // 6) filtro por estado
  const statusFilter =
    qp.status === 'all' ? Prisma.empty
    : qp.status === 'ok' ? Prisma.sql`AND ${levelCase} = 'OK'`
    : qp.status === 'belowMin' ? Prisma.sql`AND ${levelCase} = 'BELOW_MIN'`
    : qp.status === 'atZero' ? Prisma.sql`AND ${levelCase} = 'AT_ZERO'`
    : Prisma.sql`AND ${levelCase} = 'OVER_MAX'`;

  // 7) items paginados
  const items = await prisma.$queryRaw<Row[]>`
    SELECT
      spd.id AS "stockId",
      p.id   AS "productoId",
      p."nombre" AS "producto",
      p."descripcion",
      r."nombre" AS rubro,
      m."nombre" AS marca,
      u."nombre" AS unidad,
      spd."stockActual",
      spd."stockMinimo",
      spd."stockMaximo",
      ${levelCase} AS level
    FROM "StockPorDeposito" spd
    JOIN "Producto" p ON p.id = spd."productoId"
    LEFT JOIN "Rubro" r ON r.id = p."rubroId"
    LEFT JOIN "Marca" m ON m.id = p."marcaId"
    LEFT JOIN "Unidad" u ON u.id = p."unidadId"
    WHERE spd."depositoId" = ${depositId}
      ${textQ ? Prisma.sql`AND (
        LOWER(p."nombre") LIKE ${textQ} OR LOWER(COALESCE(p."descripcion", '')) LIKE ${textQ} OR
        LOWER(COALESCE(r."nombre", '')) LIKE ${textQ} OR
        LOWER(COALESCE(m."nombre", '')) LIKE ${textQ} OR
        LOWER(COALESCE(u."nombre", '')) LIKE ${textQ}
      )` : Prisma.empty}
      ${statusFilter}
    ORDER BY ${Prisma.raw(orderSql)}
    LIMIT ${take} OFFSET ${skip};
  `;

  // 8) info del depósito
  const deposito = await prisma.deposito.findUnique({
    where: { id: depositId },
    select: { id: true, nombre: true, tipo: true, estado: true },
  });
  if (!deposito) {
    return NextResponse.json({ ok: false, error: 'Deposito no encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      deposito,
      filters: qp,
      pagination: { page: qp.page, pageSize: qp.pageSize, total: S.total },
      summary: {
        totalItems: S.total,
        totalUnits: S.totalUnits,
        ok: S.ok,
        belowMin: S.below,
        atZero: S.zero,
        overMax: S.over,
      },
      items,
    },
  });
}
