"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VentasStatsCards from "@/components/ventas/VentasStatsCards";
import VentasFilters from "@/components/ventas/VentasFilters";
import VentasTable from "@/components/ventas/VentasTable";
import VentasModal from "@/components/ventas/VentasModal";
import type { Order, Warehouse, FiltersState, Stats } from "@/lib/ventas/types";
import { filterOrders } from "@/lib/ventas/utils";

type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };

type Props = {
  initialOrders: Order[];
  initialWarehouses: Warehouse[];
};

export default function VentasClient({ initialOrders, initialWarehouses }: Props) {
  const router = useRouter();

  const [allOrders, setAllOrders] = useState<Order[]>(initialOrders);

  const [filters, setFilters] = useState<FiltersState>({ status: "" });
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  const [openMovimientoModal, setOpenMovimientoModal] = useState(false);

  const [tiposMovimientoList, setTiposMovimientoList] = useState<TipoMovimientoDTO[]>([]);

  useEffect(() => {
    const fetchTiposMovimiento = async () => {
      try {
        const response = await fetch('/api/tipos-movimientos');
        if (!response.ok) {
          throw new Error('Error al cargar tipos de movimiento');
        }
        const data = await response.json();
        setTiposMovimientoList(data);
        console.log("Tipos de Movimiento cargados:", data);
      } catch (error) {
        console.error("Error fetching tipos de movimiento:", error);
      }
    };

    fetchTiposMovimiento();
  }, []);

  const balance = useMemo(
    () => allOrders.filter(o => o.status === "Enviado").reduce((s, o) => s + o.total, 0),
    [allOrders]
  );
  const orders = useMemo(() => filterOrders(allOrders, filters), [allOrders, filters]);
  const stats: Stats = useMemo(() => {
    const totalOrders = allOrders.length;
    const shippedOrders = allOrders.filter(o => o.status === "Enviado").length;
    const pendingOrders = allOrders.filter(o => o.status === "En Preparación").length;
    return { totalOrders, shippedOrders, pendingOrders, balance };
  }, [allOrders, balance]);

  const handleViewDetail = (o: Order) => {
    router.push(`/ventas/${o.id}/detalles`);
  };

  const handleDoShipment = (o: Order) => {
    console.log("Abriendo modal para pedido:", o.orderNumber);
    setSelectedPedidoId(o.orderNumber);
    setOpenMovimientoModal(true);
  };

  const refreshVentasData = async () => {
      console.log("Refrescando datos de ventas...");
      try {
          router.refresh();
          console.log("Datos de ventas refrescados.");
      } catch (error) {
          console.error("Error al refrescar ventas:", error);
      }
  };


  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
       <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Gestion de Ventas</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-1">
            Gestión de Ventas
          </h2>
          <p className="text-gray-500 text-base lg:text-lg">Gestiona y controla todos los pedidos de ventas.</p>
        </div>
      </div>

      <VentasStatsCards
        totalOrders={stats.totalOrders}
        shippedOrders={stats.shippedOrders}
        pendingOrders={stats.pendingOrders}
        balance={stats.balance}
      />

      <VentasFilters
        value={filters}
        onChange={setFilters}
        onClear={() => setFilters({ status: "" })}
      />

      <VentasTable
        orders={orders}
        onViewDetail={handleViewDetail}
        onDoShipment={handleDoShipment}
      />

      <VentasModal
        isOpen={openMovimientoModal}
        onClose={() => {
          console.log("Cerrando modal...");
          setOpenMovimientoModal(false);
          setSelectedPedidoId(null);
        }}
        pedidoId={selectedPedidoId}
        tiposMovimiento={tiposMovimientoList}
        refreshVentasData={refreshVentasData}
      />
    </main>
  );
}
