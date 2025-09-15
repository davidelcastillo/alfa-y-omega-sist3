import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

type Row = {
  detalleId: number;
  stockId: number;
  productoId: number;
  producto: string;
  unidad: string | null;
  marca: string | null;
  rubro: string | null;
  cantidad: number;
  signo: 1 | -1; // +1 ingreso, -1 egreso
  stockAntes: number; // antes de aplicar ESTE movimiento
  stockDespues: number; // después de aplicar ESTE movimiento
  stockMinimo: number;
  stockMaximo: number | null;
  estado: "OK" | "BELOW_MIN" | "AT_ZERO" | "OVER_MAX";
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const movId = Number(params.id);
  if (!Number.isInteger(movId) || movId <= 0) {
    return NextResponse.json({ ok: false, error: "Bad id" }, { status: 400 });
  }

  // Encabezado del movimiento (para meta)
  const mov = await prisma.movimientoStock.findUnique({
    where: { id: movId },
    select: {
      id: true,
      fecha: true,
      hora: true,
      numeroComprobante: true,
      deposito: { select: { id: true, nombre: true } },
      tipoMovimiento: { select: { id: true, nombre: true, saldo: true } }, // saldo=true => suma
      tipoComprobante: { select: { id: true, nombre: true } },
    },
  });

  if (!mov) {
    return NextResponse.json(
      { ok: false, error: "Movimiento no encontrado" },
      { status: 404 }
    );
  }

  // Regla de estado sobre el stock "después" de este movimiento
  const levelCase = Prisma.sql`
    CASE
      WHEN stock_despues = 0 THEN 'AT_ZERO'
      WHEN spd."stockMaximo" IS NOT NULL AND stock_despues > spd."stockMaximo" THEN 'OVER_MAX'
      WHEN stock_despues <= spd."stockMinimo" THEN 'BELOW_MIN'
      ELSE 'OK'
    END
  `;

  // Consulta: para cada detalle, calcula stockAntes/stockDespues SIN necesitar histórico completo
  // Idea: partimos del stockActual y restamos los movimientos posteriores a este; eso nos da
  // el stock "después de este movimiento". De ahí inferimos el "antes".
  const items = await prisma.$queryRaw<Row[]>`
    WITH det AS (
      SELECT
        dm.id            AS detalle_id,
        dm."stockId"     AS stock_id,
        dm."productoId"  AS producto_id,
        dm."cantidad"    AS cantidad,
        ms.id            AS mov_id,
        ms."fecha"       AS fecha,
        tm."saldo"       AS es_ingreso  -- true ingreso (+), false egreso (-)
      FROM "DetalleMovimiento" dm
      JOIN "MovimientoStock" ms ON ms.id = dm."movimientoId"
      JOIN "TipoMovimiento"  tm ON tm.id = ms."tipoMovimientoId"
      WHERE dm."movimientoId" = ${movId}
    )
    SELECT
      d.detalle_id       AS "detalleId",
      spd.id             AS "stockId",
      p.id               AS "productoId",
      p."nombre"         AS "producto",
      u."nombre"         AS "unidad",
      m."nombre"         AS "marca",
      r."nombre"         AS "rubro",
      d.cantidad         AS "cantidad",
      CASE WHEN d.es_ingreso THEN 1 ELSE -1 END::int AS "signo",

      -- suma de movimientos posteriores a ESTE (mismo stockId)
      -- criterio de “posterior”: fecha mayor o mismo día e id mayor (tie-breaker)
      (spd."stockActual"
        - COALESCE((
            SELECT SUM( (CASE WHEN tm2."saldo" THEN 1 ELSE -1 END) * dm2."cantidad" )::int
            FROM "DetalleMovimiento" dm2
            JOIN "MovimientoStock" m2 ON m2.id = dm2."movimientoId"
            JOIN "TipoMovimiento"  tm2 ON tm2.id = m2."tipoMovimientoId"
            WHERE dm2."stockId" = spd.id
              AND (m2."fecha" > d."fecha" OR (m2."fecha" = d."fecha" AND m2.id > d."mov_id"))
          ), 0)
      )::int AS stock_despues_calc,

      spd."stockMinimo",
      spd."stockMaximo",
      p."descripcion"
    FROM det d
    JOIN "StockPorDeposito" spd ON spd.id = d."stock_id"
    JOIN "Producto" p ON p.id = d."producto_id"
    LEFT JOIN "Unidad" u ON u.id = p."unidadId"
    LEFT JOIN "Marca"  m ON m.id = p."marcaId"
    LEFT JOIN "Rubro"  r ON r.id = p."rubroId"
  `;

  // Post-proceso: derivar stockAntes y estado
  const enriched: Row[] = items.map((it) => {
    const stockDespues = (it as any).stock_despues_calc as number;
    const stockAntes = stockDespues - it.signo * it.cantidad;
    const estado: Row["estado"] =
      stockDespues === 0
        ? "AT_ZERO"
        : it.stockMaximo !== null && stockDespues > it.stockMaximo
        ? "OVER_MAX"
        : stockDespues <= it.stockMinimo
        ? "BELOW_MIN"
        : "OK";

    return {
      detalleId: it.detalleId,
      stockId: it.stockId,
      productoId: it.productoId,
      producto: it.producto,
      unidad: it.unidad,
      marca: it.marca,
      rubro: it.rubro,
      cantidad: it.cantidad,
      signo: it.signo,
      stockAntes,
      stockDespues,
      stockMinimo: it.stockMinimo,
      stockMaximo: it.stockMaximo,
      estado,
    };
  });

  // Totales rápidos del movimiento
  const totalLineas = enriched.length;
  const totalIngreso = enriched
    .filter((i) => i.signo === 1)
    .reduce((s, i) => s + i.cantidad, 0);
  const totalEgreso = enriched
    .filter((i) => i.signo === -1)
    .reduce((s, i) => s + i.cantidad, 0);
  const neto = totalIngreso - totalEgreso;

  return NextResponse.json({
    ok: true,
    data: {
      movimiento: {
        id: mov.id,
        fecha: mov.fecha,
        hora: mov.hora,
        comprobante: mov.tipoComprobante?.nombre ?? null,
        numeroComprobante: mov.numeroComprobante ?? null,
        deposito: mov.deposito,
        tipoMovimiento: mov.tipoMovimiento,
      },
      summary: { totalLineas, totalIngreso, totalEgreso, neto },
      items: enriched,
    },
  });
}
