"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

type Props = {
    title: string;
    data: { periodo: string; ingresos: number; egresos: number }[];
};

export default function ChartBlock({ title, data }: Props) {
    return (
        <div className="glass rounded-2xl p-4 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">a
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                        barGap={6} // separación entre barras del mismo grupo
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="periodo" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => value.toLocaleString("es-AR", { style: "currency", currency: "ARS" })} />
                        <Legend />
                        <Bar
                            dataKey="ingresos"
                            fill="#22c55e" // verde
                            name="Ingresos"
                        />
                        <Bar
                            dataKey="egresos"
                            fill="#ef4444" // rojo
                            name="Egresos"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
