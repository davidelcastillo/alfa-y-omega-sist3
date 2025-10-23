// src/app/ventas/VentasClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VentasStatsCards from "@/components/ventas/VentasStatsCards";
import VentasFilters from "@/components/ventas/VentasFilters";
import VentasTable from "@/components/ventas/VentasTable";
import VentasModal from "@/components/ventas/VentasModal";
import type {
  Order,
  Warehouse,
  FiltersState,
  Stats,
} from "@/lib/ventas/types";
import { filterOrders } from "@/lib/ventas/utils";
import { MovimientoPayload } from "@/components/ventas/VentasModal";

// Mock data that should be fetched from the server in a real app
const mockDepositos = [
  { id: 1, name: "Depósito Central" },
  { id: 2, name: "Depósito Norte" },
];

const mockProductosPorDeposito = {
  1: [
    { id: 1, descripcion: "Producto A", codigo: "P001" },
    { id: 2, descripcion: "Producto B", codigo: "P002" },
  ],
  2: [
    { id: 3, descripcion: "Producto C", codigo: "P003" },
    { id: 4, descripcion: "Producto D", codigo: "P004" },
  ],
};

const mockStockIndex = {
  1: { 1: 100, 2: 50 },
  2: { 3: 200, 4: 75 },
};

const mockTiposMovimiento = [
  { id: 6, nombre: "Egreso por Venta", saldo: false },
];

type Props = {
  initialOrders: Order[];
  initialWarehouses: Warehouse[];
};

export default function VentasClient({ initialOrders, initialWarehouses }: Props) {
  const router = useRouter();

  const [allOrders, setAllOrders] = useState<Order[]>(initialOrders);
  const [warehouses] = useState<Warehouse[]>(initialWarehouses);

  const [filters, setFilters] = useState<FiltersState>({ status: "" });
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  const [openMovimientoModal, setOpenMovimientoModal] = useState(false);

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
    setSelectedPedidoId(o.orderNumber);
    setOpenMovimientoModal(true);
  };

  const handleSubmitMovimiento = async (payload: MovimientoPayload) => {
    try {
      // Here you would call the API to create the stock movement
      console.log("Submitting stock movement:", payload);
      // On success, you might want to update the order status
      setAllOrders(prev =>
        prev.map(o =>
          o.orderNumber === payload.numeroComprobante
            ? { ...o, status: "Enviado" }
            : o
        )
      );
    } catch (error) {
      console.error("Failed to submit stock movement:", error);
    }
    setOpenMovimientoModal(false);
    setSelectedPedidoId(null);
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
        onSearch={() => {}}
      />

      <VentasTable
        orders={orders}
        onViewDetail={handleViewDetail}
        onDoShipment={handleDoShipment}
      />

      <VentasModal
        isOpen={openMovimientoModal}
        onClose={() => {
          setOpenMovimientoModal(false);
          setSelectedPedidoId(null);
        }}
        onSubmit={handleSubmitMovimiento}
        pedidoId={selectedPedidoId}
        depositos={mockDepositos}
        productosPorDeposito={mockProductosPorDeposito}
        stockIndex={mockStockIndex}
        tiposMovimiento={mockTiposMovimiento}
      />
    </main>
  );
}
