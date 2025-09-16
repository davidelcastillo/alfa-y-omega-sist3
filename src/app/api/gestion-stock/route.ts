import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { gestionStockQuerySchema } from "./schema";

type Row = {
  stockId: number;
  productoId: number;
  producto: string;
  descripcion: string | null;
  rubro: string | null;
  marca: string | null;
  unidad: string | null;
  depositoId: number;
  depositoNombre: string;
  depositoUbicacion: string | null;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number | null;
  level: "OK" | "BELOW_MIN" | "AT_ZERO" | "OVER_MAX";
};

export async function GET(req: Request) {
  try {
    // 1) validar query
    const qp = gestionStockQuerySchema.parse(
      Object.fromEntries(new URL(req.url).searchParams)
    );

    const skip = (qp.page - 1) * qp.pageSize;
    const take = qp.pageSize;

    // 2) ordenar seguro
    const sortMap: Record<typeof qp.sort, string> = {
      nombre: 'p."nombre"',
      stock: 'spd."stockActual"',
      stockMinimo: 'spd."stockMinimo"',
      stockMaximo: 'spd."stockMaximo"',
      updatedAt: 'spd."updatedAt"',
    };
    const orderSql = sortMap[qp.sort] ?? 'p."nombre"';

    // 3) CASE nivel
    const levelCase = Prisma.sql`
      CASE
        WHEN spd."stockActual" = 0 THEN 'AT_ZERO'
        WHEN spd."stockMaximo" IS NOT NULL AND spd."stockActual" > spd."stockMaximo" THEN 'OVER_MAX'
        WHEN spd."stockActual" <= spd."stockMinimo" THEN 'BELOW_MIN'
        ELSE 'OK'
      END
    `;

    const textQ = qp.q ? `%${qp.q.toLowerCase()}%` : null;

    // 4) condiciones dinámicas
    const conditions: Prisma.Sql[] = [];

    if (qp.depositId) {
      conditions.push(Prisma.sql`spd."depositoId" = ${qp.depositId}`);
    }

    if (textQ) {
      conditions.push(Prisma.sql`
        (
          LOWER(p."nombre") LIKE ${textQ} OR LOWER(COALESCE(p."descripcion", '')) LIKE ${textQ} OR
          LOWER(COALESCE(r."nombre", '')) LIKE ${textQ} OR
          LOWER(COALESCE(m."nombre", '')) LIKE ${textQ} OR
          LOWER(COALESCE(u."nombre", '')) LIKE ${textQ}
        )
      `);
    }

    if (qp.status !== "all") {
      const statusFilter =
        qp.status === "ok" ? Prisma.sql`${levelCase} = 'OK'`
        : qp.status === "belowMin" ? Prisma.sql`${levelCase} = 'BELOW_MIN'`
        : qp.status === "atZero" ? Prisma.sql`${levelCase} = 'AT_ZERO'`
        : Prisma.sql`${levelCase} = 'OVER_MAX'`;

      conditions.push(statusFilter);
    }

    const whereSql =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, Prisma.sql` AND `)}`
        : Prisma.empty;

    // 5) summary global
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
        ${whereSql}
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

    // 6) items
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
        d."id" AS "depositoId",
        d."nombre" AS "depositoNombre",
        d."ubicacion" AS "depositoUbicacion",
        ${levelCase} AS level
      FROM "StockPorDeposito" spd
      JOIN "Producto" p ON p.id = spd."productoId"
      JOIN "Deposito" d ON d.id = spd."depositoId"
      LEFT JOIN "Rubro" r ON r.id = p."rubroId"
      LEFT JOIN "Marca" m ON m.id = p."marcaId"
      LEFT JOIN "Unidad" u ON u.id = p."unidadId"
      ${whereSql}
      ORDER BY ${Prisma.raw(orderSql)}
      LIMIT ${take} OFFSET ${skip};
    `;

    return NextResponse.json({
      ok: true,
      data: {
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
  } catch (err: any) {
    console.error("Error en /api/gestion-stock:", err);
    return NextResponse.json(
      { ok: false, error: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}
