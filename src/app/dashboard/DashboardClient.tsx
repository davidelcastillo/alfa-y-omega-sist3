// src/app/dashboard/DashboardClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { apiGetDashboardResumen } from "@/lib/dashboard/api";
import type {
    DashboardResumen,
    Granularidad,
    DashboardPoint,   // 👈 punto de la serie
} from "@/lib/dashboard/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

type Props = {
    initialDesde: string;
    initialHasta: string;
    initialGran: Granularidad;
};

export default function DashboardClient({
    initialDesde,
    initialHasta,
    initialGran,
}: Props) {
    const [desde, setDesde] = useState(initialDesde);
    const [hasta, setHasta] = useState(initialHasta);
    const [gran, setGran] = useState<Granularidad>(initialGran);
    const [data, setData] = useState<DashboardResumen | null>(null);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await apiGetDashboardResumen({ desde, hasta, gran });
            setData(res);
        } finally {
            setLoading(false);
        }
    }

    // ⬇️ Ejecutar una vez al montar (y silenciar dependencia 'load')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(); }, []);

    // ⬇️ nombre correcto: series (plural)
    const series = useMemo<DashboardPoint[]>(
        () => data?.series ?? [],
        [data]
    );

    return (
        <>
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <span>Inicio</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-primary-pink font-medium">Dashboard</span>
            </div>

            {/* Header de la sección */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
                        Resumen del Corralón
                    </h2>
                    <p className="text-gray-600 text-lg">Ingresos, egresos y resultado por período</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white border rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                    <label className="text-sm text-gray-600">Desde</label>
                    <input
                        type="date"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Hasta</label>
                    <input
                        type="date"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Granularidad</label>
                    <select
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={gran}
                        onChange={(e) => setGran(e.target.value as Granularidad)}
                    >
                        <option value="dia">Día</option>
                        <option value="mes">Mes</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <Button
                        disabled={loading}
                        onClick={load}
                        className="w-full"
                    >
                        {loading ? "Cargando..." : "Aplicar"}
                    </Button>
                </div>
            </div>

            {/* Totales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card title="Ingresos" value={data?.totales.ingresos ?? 0} />
                <Card title="Egresos" value={data?.totales.egresos ?? 0} />
                <Card title="Resultado" value={data?.totales.resultado ?? 0} />
            </div>

            {/* Gráficos */}
            <ChartBlock title="Ingresos" data={series} dataKey="ingresos" />
            <ChartBlock title="Egresos" data={series} dataKey="egresos" />
            <ChartBlock title="Resultado" data={series} dataKey="resultado" />
        </>
    );
}

function Card({ title, value }: { title: string; value: number }) {
    const $$ = (n: number) =>
        n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-semibold mt-1">{$$(value)}</div>
        </div>
    );
}

function ChartBlock({
    title,
    data,
    dataKey,
}: {
    title: string;
    data: DashboardPoint[]; // o DashboardPunto si ese es tu nombre exacto
    dataKey: "ingresos" | "egresos" | "resultado";
}) {
    const hasData = data.length > 0 && data.some(d => Number(d[dataKey] ?? 0) !== 0);

    // Dominio que siempre incluye 0 (evita barras “gigantes” si todo es negativo o todo positivo)
    const domain: [number, number] = [
        Math.min(0, ...data.map(d => Number(d[dataKey] ?? 0))),
        Math.max(0, ...data.map(d => Number(d[dataKey] ?? 0))),
    ];

    // Colores simples por serie
    const fill =
        dataKey === "ingresos" ? "#22c55e" : dataKey === "egresos" ? "#ef4444" : "#6366f1";

    return (
        <div className="bg-white border rounded-xl p-4 mb-6">
            <div className="text-lg font-semibold mb-3">{title}</div>

            {!hasData ? (
                <div className="h-72 flex items-center justify-center text-sm text-gray-500">
                    Sin datos para el período seleccionado
                </div>
            ) : (
                <div className="w-full h-72">
                    <ResponsiveContainer width="99%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                            barSize={28}
                            barCategoryGap="18%"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            {/* 👇 clave correcta del DTO */}
                            <XAxis dataKey="periodo" tickMargin={6} />
                            <YAxis
                                domain={domain}
                                tickFormatter={(v) => Number(v).toLocaleString("es-AR")}
                            />
                            <Tooltip
                                formatter={(v: number, k: string) =>
                                    [
                                        Number(v).toLocaleString("es-AR", { style: "currency", currency: "ARS" }),
                                        k,
                                    ] as any
                                }
                                labelFormatter={(lbl) => `Período: ${lbl}`}
                            />
                            <Bar dataKey={dataKey} fill={fill} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
