// src/app/api/dashboard/resumen/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QSchema = z.object({
    desde: z.string().refine(v => !Number.isNaN(Date.parse(v)), "desde inválido"),
    hasta: z.string().refine(v => !Number.isNaN(Date.parse(v)), "hasta inválido"),
    gran: z.enum(["dia", "mes"]).default("mes"),
});
type Gran = z.infer<typeof QSchema>["gran"];

// helpers: parsear YYYY-MM-DD como fecha LOCAL (00:00:00 local)
function parseLocalDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map((x) => Number(x));
    return new Date(y, m - 1, d); // año, mesIndex (0-based), día -> hora local 00:00:00
}

function fmtKeyLocal(d: Date, gran: Gran) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    if (gran === "mes") return `${y}-${m}`; // YYYY-MM (local)
    return `${y}-${m}-${day}`; // YYYY-MM-DD (local)
}

function endOfDayLocal(d: Date) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999); // local end of day
    return x;
}

function walkBucketsLocal(desde: Date, hasta: Date, gran: Gran) {
    const out: string[] = [];
    const cur = new Date(desde);
    cur.setHours(0, 0, 0, 0);
    const end = endOfDayLocal(hasta);
    while (cur <= end) {
        out.push(fmtKeyLocal(cur, gran));
        if (gran === "mes") {
            cur.setMonth(cur.getMonth() + 1, 1);
            cur.setHours(0, 0, 0, 0);
        } else {
            cur.setDate(cur.getDate() + 1);
            cur.setHours(0, 0, 0, 0);
        }
    }
    return out;
}


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        // parsear como LOCAL
        const query = QSchema.parse({
            desde: searchParams.get("desde"),
            hasta: searchParams.get("hasta"),
            gran: searchParams.get("gran") ?? undefined,
        });
        const desde = parseLocalDate(query.desde);
        const hasta = parseLocalDate(query.hasta);


        // ===== Pedidos ENVIADOS (para métricas de conteo, como antes) =====
        const estadoEnviado = await prisma.estadoPedido.findUnique({ where: { nombre: "Enviado" } });
        if (!estadoEnviado) throw new Error("El estado de pedido 'ENVIADO' no existe.");

        const pedidos = await prisma.pedido.findMany({
            where: {
                estadoPedidoId: estadoEnviado.id,
                fechaPedido: { gte: desde, lte: endOfDayLocal(hasta) },
            },
            select: { total: true, fechaPedido: true },
        });

        // ===== Ingresos: ahora desde ComprobanteCliente (facturas/pagos de clientes) =====
        // consideramos comprobantes con estado = true (emitidos/pagados según tu modelo)
        const comprobantes = await prisma.comprobanteCliente.findMany({
            where: {
                estado: true,
                fecha: { gte: desde, lte: endOfDayLocal(hasta) },
            },
            select: { total: true, fecha: true },
        });

        // ===== Egresos: Órdenes de pago a proveedores =====
        const ops = await prisma.ordenPago.findMany({
            where: { fecha: { gte: desde, lte: endOfDayLocal(hasta) } },
            select: { totalPagado: true, fecha: true },
        });

        // ===== Nuevos Clientes =====
        const nuevosClientes = await prisma.usuario.count({
            where: { fechaRegistro: { gte: desde, lte: endOfDayLocal(hasta) } }
        });

        // ===== Pedidos Totales en el período =====
        const pedidosTotales = pedidos.length;

        const buckets = walkBucketsLocal(desde, hasta, query.gran);
        const map: Record<string, { ingresos: number; egresos: number }> = {};
        for (const k of buckets) map[k] = { ingresos: 0, egresos: 0 };

        // agrego ingresos desde comprobantes
        for (const c of comprobantes) {
            const k = fmtKeyLocal(new Date(c.fecha), query.gran);
            if (!map[k]) map[k] = { ingresos: 0, egresos: 0 };
            map[k].ingresos += Number(c.total ?? 0);
        }

        // agrego egresos
        for (const o of ops) {
            const k = fmtKeyLocal(new Date(o.fecha), query.gran);
            if (!map[k]) map[k] = { ingresos: 0, egresos: 0 };
            map[k].egresos += Number(o.totalPagado ?? 0);
        }

        const series = buckets.map(k => ({
            periodo: k,
            ingresos: Number(map[k]?.ingresos ?? 0),
            egresos: Number(map[k]?.egresos ?? 0),
            resultado: Number((map[k]?.ingresos ?? 0) - (map[k]?.egresos ?? 0)),
        }));

        const totales = series.reduce(
            (a, r) => {
                a.ingresos += r.ingresos;
                a.egresos += r.egresos;
                a.resultado += r.resultado;
                return a;
            },
            { ingresos: 0, egresos: 0, resultado: 0 }
        );

        return NextResponse.json({
            ok: true,
            data: {
                desde: query.desde,
                hasta: query.hasta,
                gran: query.gran,
                totales: {
                    ...totales,
                    nuevosClientes,
                    pedidosTotales,
                },
                series,
            },
        });
    } catch (err: any) {
        console.error("[GET /api/dashboard/resumen]", err);
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Error en resumen" },
            { status: 400 }
        );
    }
}
