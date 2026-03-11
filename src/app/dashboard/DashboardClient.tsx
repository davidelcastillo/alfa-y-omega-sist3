// src/app/dashboard/DashboardClient.tsx
"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
    apiGetDashboardResumen,
    apiGetProductosMasVendidos,
    apiGetAlertaStock,
} from "@/lib/dashboard/api";
import type {
    DashboardResumen,
    Granularidad,
    ProductoMasVendido,
    AlertaStock,
} from "@/lib/dashboard/types";
import KpiCard from "@/components/dashboard/KpiCard";
import ProductosMasVendidosChart from "@/components/dashboard/ProductosMasVendidosChart";
import AlertaStockTable from "@/components/dashboard/AlertaStockTable";
import ChartBlock from "@/components/dashboard/ChartBlock";
import CombinedIngresosEgresosChart from "@/components/dashboard/CombinedIngresosEgresosChart";
import { DollarSign, ShoppingCart, UserPlus, TrendingDown } from "lucide-react";

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
    const [resumen, setResumen] = useState<DashboardResumen | null>(null);
    const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([]);
    const [alertaStock, setAlertaStock] = useState<AlertaStock[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const [resumenData, masVendidosData, alertaStockData] = await Promise.all([
                apiGetDashboardResumen({ desde, hasta, gran }),
                apiGetProductosMasVendidos(),
                apiGetAlertaStock(),
            ]);
            setResumen(resumenData);
            setProductosMasVendidos(masVendidosData);
            setAlertaStock(alertaStockData);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    const money = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

    return (
        <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
                        Dashboard del Corralón
                    </h2>
                    <p className="text-gray-600 text-lg">Una vista general de tu negocio.</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="glass rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="text-sm font-medium text-gray-700">Desde</label>
                    <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Hasta</label>
                    <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Granularidad</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={gran}
                        onChange={(e) => setGran(e.target.value as Granularidad)}
                    >
                        <option value="dia">Día</option>
                        <option value="mes">Mes</option>
                    </select>
                </div>
                <Button
                    disabled={loading}
                    onClick={load}
                    className="w-full"
                    variant="primary"
                >
                    {loading ? "Cargando..." : "Aplicar"}
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10">Cargando datos...</div>
            ) : (
                <>
                    {/* KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KpiCard
                            title="Ingresos Totales"
                            value={money(resumen?.totales.ingresos ?? 0)}
                            icon={<DollarSign className="text-white" />}
                            colorClass="bg-green-500"
                        />
                        <KpiCard
                            title="Egresos Totales"
                            value={money(resumen?.totales.egresos ?? 0)}
                            icon={<TrendingDown className="text-white" />}
                            colorClass="bg-red-500"
                        />
                        <KpiCard
                            title="Nuevos Clientes"
                            value={resumen?.totales.nuevosClientes ?? 0}
                            icon={<UserPlus className="text-white" />}
                            colorClass="bg-blue-500"
                        />
                        <KpiCard
                            title="Pedidos Totales"
                            value={resumen?.totales.pedidosTotales ?? 0}
                            icon={<ShoppingCart className="text-white" />}
                            colorClass="bg-orange-500"
                        />
                    </div>

                    

                    {/* Gráficos y Tablas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <ProductosMasVendidosChart data={productosMasVendidos} />
                        <AlertaStockTable data={alertaStock} />
                    </div>

                    {/* Gráficos por período */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <div className="rounded-2xl border p-4 shadow-sm">
                            <h3 className="text-lg font-medium mb-3">Ingresos vs Egresos por período</h3>
                            <CombinedIngresosEgresosChart data={resumen?.series ?? []} height={360} />
                        </div>
                    </div>

                </>
            )}
        </main>
    );
}