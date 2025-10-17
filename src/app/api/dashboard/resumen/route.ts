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

function fmtKey(d: Date, gran: Gran) {
    if (gran === "mes") return d.toISOString().slice(0, 7);       // YYYY-MM
    return d.toISOString().slice(0, 10);                           // YYYY-MM-DD
}
function endOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
}
function walkBuckets(desde: Date, hasta: Date, gran: Gran) {
    const out: string[] = [];
    const cur = new Date(desde);
    cur.setHours(0, 0, 0, 0);
    const end = endOfDay(hasta);
    while (cur <= end) {
        out.push(fmtKey(cur, gran));
        if (gran === "mes") {
            cur.setMonth(cur.getMonth() + 1, 1);
        } else {
            cur.setDate(cur.getDate() + 1);
        }
    }
    return out;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = QSchema.parse({
            desde: searchParams.get("desde"),
            hasta: searchParams.get("hasta"),
            gran: searchParams.get("gran") ?? undefined,
        });

        const desde = new Date(query.desde);
        const hasta = new Date(query.hasta);

        // ===== Ingresos: Pedidos con estado "ENVIADO" =====
        const estadoEnviado = await prisma.estadoPedido.findUnique({ where: { nombre: "Enviado" } });
        if (!estadoEnviado) throw new Error("El estado de pedido 'ENVIADO' no existe.");

        const pedidos = await prisma.pedido.findMany({
            where: {
                estadoPedidoId: estadoEnviado.id,
                fechaPedido: { gte: desde, lte: endOfDay(hasta) },
            },
            select: { total: true, fechaPedido: true },
        });

        // ===== Egresos: Órdenes de pago a proveedores =====
        const ops = await prisma.ordenPago.findMany({
            where: { fecha: { gte: desde, lte: endOfDay(hasta) } },
            select: { totalPagado: true, fecha: true },
        });

        // ===== Nuevos Clientes =====
        const nuevosClientes = await prisma.usuario.count({
            where: { fechaRegistro: { gte: desde, lte: endOfDay(hasta) } }
        });

        // ===== Pedidos Totales en el período =====
        const pedidosTotales = pedidos.length;

        const buckets = walkBuckets(desde, hasta, query.gran);
        const map: Record<string, { ingresos: number; egresos: number }> = {};
        for (const k of buckets) map[k] = { ingresos: 0, egresos: 0 };

        // agrego ingresos
        for (const p of pedidos) {
            const k = fmtKey(new Date(p.fechaPedido), query.gran);
            if (!map[k]) map[k] = { ingresos: 0, egresos: 0 };
            map[k].ingresos += Number(p.total ?? 0);
        }
        // agrego egresos
        for (const o of ops) {
            const k = fmtKey(new Date(o.fecha), query.gran);
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
