// src/app/ventas/VentasClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 nuevo
import VentasStatsCards from "@/components/ventas/VentasStatsCards";
import VentasFilters from "@/components/ventas/VentasFilters";
import VentasTable from "@/components/ventas/VentasTable";
import VentasModal from "@/components/ventas/VentasModal";
import type {
  Order,
  Warehouse,
  FiltersState,
  ShipmentPayload,
  Stats,
} from "@/lib/ventas/types";
import { filterOrders } from "@/lib/ventas/utils";

type Props = {
  initialOrders: Order[];
  initialWarehouses: Warehouse[];
};

export default function VentasClient({ initialOrders, initialWarehouses }: Props) {
  const router = useRouter(); // 👈

  const [allOrders, setAllOrders] = useState<Order[]>(initialOrders);
  const [warehouses] = useState<Warehouse[]>(initialWarehouses);

  const [filters, setFilters] = useState<FiltersState>({ status: "" });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openShipment, setOpenShipment] = useState(false);

  // Balance simulado (suma de totales enviados)
  const balance = useMemo(
    () => allOrders.filter(o => o.status === "Enviado").reduce((s, o) => s + o.total, 0),
    [allOrders]
  );

  // Lista filtrada
  const orders = useMemo(() => filterOrders(allOrders, filters), [allOrders, filters]);

  // Stats
  const stats: Stats = useMemo(() => {
    const totalOrders = allOrders.length;
    const shippedOrders = allOrders.filter(o => o.status === "Enviado").length;
    const pendingOrders = allOrders.filter(o => o.status === "Pendiente de enviar").length;
    return { totalOrders, shippedOrders, pendingOrders, balance };
  }, [allOrders, balance]);

  // Acciones
  const handleViewDetail = (o: Order) => {
    // 👇 redirección al detalle
    router.push(`/ventas/${o.id}/detalles`);
  };

  const handleDoShipment = (o: Order) => {
    setSelectedOrder(o);
    setOpenShipment(true);
  };

  const handleConfirmShipment = (payload: ShipmentPayload) => {
    setAllOrders(prev =>
      prev.map(o =>
        o.id === payload.orderId
          ? {
              ...o,
              status: "Enviado",
              shippedDate: new Date().toISOString().slice(0, 10),
              warehouse: warehouses.find(w => w.id === payload.warehouseId)?.name,
              products: payload.products,
              total: payload.total,
              history: [
                ...o.history,
                {
                  date: new Date().toLocaleString(),
                  action: `Pedido enviado desde ${warehouses.find(w => w.id === payload.warehouseId)?.name}`,
                  user: "Usuario Actual",
                },
              ],
            }
          : o
      )
    );
    setOpenShipment(false);
    setSelectedOrder(null);
  };

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Gestion de Ventas</span>
      </div>

      {/* Header de la sección */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Gestión de Ventas
          </h2>
          <p className="text-gray-600 text-lg">Gestiona y controla todos los pedidos de ventas</p>
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
        onSearch={() => {
          /* futuro fetch si conectás API */
        }}
      />

      <VentasTable
        orders={orders}
        onViewDetail={handleViewDetail}     // 👈 pasa la acción
        //onDoShipment={handleDoShipment}
      />

      {/* Modal Envío */}
      <VentasModal
        open={openShipment}
        order={
          selectedOrder
            ? {
                id: selectedOrder.id,
                orderNumber: selectedOrder.orderNumber,
                customerName: selectedOrder.customerName,
                cardNumber: selectedOrder.cardNumber,
                products: selectedOrder.products,
              }
            : null
        }
        warehouses={warehouses}
        onClose={() => {
          setOpenShipment(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmShipment}
      />
    </main>
  );
}
