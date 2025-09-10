// src/app/api/movimientos/export/route.ts
// Runtime Node para usar streams de Node y libs nativas.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ────────────── Helpers ──────────────
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  // Escapar comillas dobles y envolver en comillas si hace falta
  const needsQuotes = /[",\n\r]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function filename(prefix: string, ext: 'csv' | 'xlsx') {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const name =
    `${prefix}_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.${ext}`;
  return name;
}

type Filters = {
  start: Date;
  end: Date;
  depositoId?: number | null;
  tipoMovimientoId?: number | null;
  rubroId?: number | null;
  productoId?: number | null;
};

// Query de página: retorna filas detalladas para export
async function fetchPage(
  cursorAfterDetalleId: number | null,
  limit: number,
  f: Filters
) {
  const rows = await prisma.$queryRawUnsafe<Array<{
    detalle_id: number;
    fecha: Date;
    deposito: string;
    tipo_movimiento: string;
    es_ingreso: boolean;
    tipo_comprobante: string;
    producto: string;
    rubro: string;
    cantidad: number;
  }>>(
    `
    SELECT
      dm.id                         AS detalle_id,
      ms.fecha                      AS fecha,
      d.nombre                      AS deposito,
      tm.nombre                     AS tipo_movimiento,
      tm."ingresoEgreso"            AS es_ingreso,
      tc.nombre                     AS tipo_comprobante,
      p.nombre                      AS producto,
      r.nombre                      AS rubro,
      dm.cantidad                   AS cantidad
    FROM "DetalleMovimiento" dm
    JOIN "MovimientoStock" ms       ON ms.id = dm."movimientoId"
    JOIN "StockPorDeposito" s       ON s.id  = dm."stockId"
    JOIN "Producto" p               ON p.id  = s."productoId"
    JOIN "Rubro" r                  ON r.id  = p."rubroId"
    JOIN "Deposito" d               ON d.id  = ms."depositoId"
    JOIN "TipoMovimiento" tm        ON tm.id = ms."tipoMovimientoId"
    JOIN "TipoComprobante" tc       ON tc.id = ms."tipoComprobanteId"
    WHERE ms.fecha >= $1
      AND ms.fecha <  $2
      AND ($3::int IS NULL OR ms."depositoId" = $3)
      AND ($4::int IS NULL OR tm.id = $4)
      AND ($5::int IS NULL OR p."rubroId" = $5)
      AND ($6::int IS NULL OR p.id = $6)
      AND ($7::int IS NULL OR dm.id > $7)
    ORDER BY dm.id ASC
    LIMIT $8
    `,
    f.start,
    f.end,
    f.depositoId ?? null,
    f.tipoMovimientoId ?? null,
    f.rubroId ?? null,
    f.productoId ?? null,
    cursorAfterDetalleId,
    limit
  );
  return rows;
}

// ────────────── Handler ──────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get('format') || 'csv').toLowerCase();
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // Rango por defecto: últimos 30 días
    const endDefault = new Date();
    const startDefault = new Date(endDefault.getTime() - 30 * 24 * 60 * 60 * 1000);

    const filters: Filters = {
      start: startParam ? new Date(startParam) : startDefault,
      end: endParam ? new Date(endParam) : endDefault,
      depositoId: searchParams.get('depositoId') ? Number(searchParams.get('depositoId')) : null,
      tipoMovimientoId: searchParams.get('tipoMovimientoId') ? Number(searchParams.get('tipoMovimientoId')) : null,
      rubroId: searchParams.get('rubroId') ? Number(searchParams.get('rubroId')) : null,
      productoId: searchParams.get('productoId') ? Number(searchParams.get('productoId')) : null,
    };

    const batchSize = Math.min(
      Number(searchParams.get('batch') || 1000),
      5000
    ); // seguridad para no saturar

    if (format !== 'csv' && format !== 'xlsx') {
      return NextResponse.json({ error: 'Parámetro format inválido. Use csv|xlsx' }, { status: 400 });
    }

    if (format === 'csv') {
      // ───────── CSV STREAMING ─────────
      const stream = new ReadableStream({
        async start(controller) {
          const enc = new TextEncoder();
          // Header
          const header = [
            'detalle_id',
            'fecha',
            'deposito',
            'tipo_movimiento',
            'es_ingreso',
            'tipo_comprobante',
            'producto',
            'rubro',
            'cantidad',
          ].join(',') + '\r\n';
          controller.enqueue(enc.encode(header));

          let cursor: number | null = null;
          while (true) {
            const rows = await fetchPage(cursor, batchSize, filters);
            if (!rows.length) break;

            let chunk = '';
            for (const r of rows) {
              chunk += [
                csvEscape(r.detalle_id),
                csvEscape(r.fecha.toISOString()),
                csvEscape(r.deposito),
                csvEscape(r.tipo_movimiento),
                csvEscape(r.es_ingreso ? 1 : 0),
                csvEscape(r.tipo_comprobante),
                csvEscape(r.producto),
                csvEscape(r.rubro),
                csvEscape(r.cantidad),
              ].join(',') + '\r\n';
            }
            controller.enqueue(enc.encode(chunk));
            cursor = rows[rows.length - 1].detalle_id; // avanzar cursor
          }

          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename('movimientos', 'csv')}"`,
          // Evita buffering en algunos proxies
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-store',
        },
      });
    }

    // ───────── XLSX STREAMING (exceljs) ─────────
    // Requiere instalación previa: npm i exceljs
    // Usa escritor en streaming para no cargar en memoria todo el workbook.
    const { PassThrough } = await import('stream');
    let ExcelJS: any;
    try {
      ExcelJS = (await import('exceljs')).default ?? (await import('exceljs'));
    } catch {
      return NextResponse.json(
        { error: 'Para XLSX instalá exceljs: npm i exceljs' },
        { status: 400 }
      );
    }

    const pass = new PassThrough();

    (async () => {
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: pass });
      const sheet = workbook.addWorksheet('Movimientos');

      // Header
      sheet.addRow([
        'detalle_id',
        'fecha',
        'deposito',
        'tipo_movimiento',
        'es_ingreso',
        'tipo_comprobante',
        'producto',
        'rubro',
        'cantidad',
      ]).commit();

      let cursor: number | null = null;
      while (true) {
        const rows = await fetchPage(cursor, batchSize, filters);
        if (!rows.length) break;
        for (const r of rows) {
          sheet.addRow([
            r.detalle_id,
            r.fecha.toISOString(),
            r.deposito,
            r.tipo_movimiento,
            r.es_ingreso ? 1 : 0,
            r.tipo_comprobante,
            r.producto,
            r.rubro,
            r.cantidad,
          ]).commit();
        }
        cursor = rows[rows.length - 1].detalle_id;
      }

      await sheet.commit();
      await workbook.commit(); // cierra el zip al stream
    })().catch((e) => {
      pass.destroy(e);
    });

    return new Response(pass as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename('movimientos', 'xlsx')}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('GET /api/movimientos/export error', err);
    return NextResponse.json(
      { error: 'Error al exportar movimientos', details: err?.message },
      { status: 500 }
    );
  }
}
