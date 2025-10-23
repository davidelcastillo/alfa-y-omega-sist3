// src/components/dashboard/CombinedIngresosEgresosChart.tsx
"use client";

import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";

type Row = {
    periodo: string;
    ingresos: number;
    egresos: number;
};

export default function CombinedIngresosEgresosChart({
    data,
    height = 360,
}: {
    data: Row[];
    height?: number;
}) {
    // ordenar por periodo (por si viene desordenado)
    const rows = [...(data || [])].sort((a, b) => (a.periodo < b.periodo ? -1 : 1));

    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={rows}
                    margin={{ top: 16, right: 24, left: 8, bottom: 36 }}
                    barGap={8} // separación entre barras del mismo grupo
                    barCategoryGap="25%" // separación entre grupos
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="periodo"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                        angle={-35}
                        textAnchor="end"
                        height={56}
                    />
                    <YAxis
                        tickFormatter={(v) =>
                            Number(v).toLocaleString("es-AR", { style: "currency", currency: "ARS" })
                        }
                    />
                    <Tooltip
                        formatter={(value: any) =>
                            Number(value).toLocaleString("es-AR", { style: "currency", currency: "ARS" })
                        }
                    />
                    <Legend verticalAlign="bottom" height={36} />
                    {/* BARRAS lado a lado (NO stackId) */}
                    <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" maxBarSize={48} />
                    <Bar dataKey="egresos" name="Egresos" fill="#EF4444" maxBarSize={48} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
