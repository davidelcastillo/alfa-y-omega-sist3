"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    LabelList,
} from "recharts";

type Props = {
    data: { nombre: string; cantidadVendida: number }[];
};

export default function ProductosMasVendidosChart({ data }: Props) {
    return (
        <div className="glass rounded-2xl p-6 h-[400px]">
            <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip
                        formatter={(value) => [`${value} unidades`, "Cantidad Vendida"]}
                    />
                    <Bar dataKey="cantidadVendida" fill="#8884d8">
                        <LabelList dataKey="cantidadVendida" position="right" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}