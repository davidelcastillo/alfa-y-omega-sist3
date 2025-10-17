"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import type { DashboardPoint } from "@/lib/dashboard/types";

type Props = {
    title: string;
    data: DashboardPoint[];
    dataKey: "ingresos" | "egresos" | "resultado";
};

export default function ChartBlock({ title, data, dataKey }: Props) {
    const hasData = data.length > 0 && data.some(d => Number(d[dataKey] ?? 0) !== 0);

    const domain: [number, number] = [
        Math.min(0, ...data.map(d => Number(d[dataKey] ?? 0))),
        Math.max(0, ...data.map(d => Number(d[dataKey] ?? 0))),
    ];

    const fill =
        dataKey === "ingresos" ? "#22c55e" : dataKey === "egresos" ? "#ef4444" : "#6366f1";

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
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