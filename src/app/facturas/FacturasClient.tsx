// src/app/facturas/FacturasClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// Asumo que clonarás y modificarás estos componentes:
import FacturasStatsCards from "@/components/facturas/FacturasStatsCards";
import FacturasFilters from "@/components/facturas/FacturasFilters";
import FacturasTable from "@/components/facturas/FacturasTable";
// Importamos los nuevos tipos
import type {
  Factura, // <-- MODIFICADO
  Deposito, // <-- MODIFICADO (Asumiendo que Deposito es tu tipo para Warehouse)
  FiltersState,
  Stats,
} from "@/lib/facturas/types"; // <-- MODIFICADO
import { filterFacturas } from "@/lib/facturas/utils"; // <-- MODIFICADO (Necesitarás crear este archivo)

type Props = {
  initialFacturas: Factura[]; // <-- MODIFICADO
  initialDepositos: Deposito[]; // <-- MODIFICADO
};

export default function FacturasClient({ initialFacturas, initialDepositos }: Props) { // <-- MODIFICADO
  const router = useRouter();

  const [allFacturas, setAllFacturas] = useState<Factura[]>(initialFacturas); // <-- MODIFICADO
  const [depositos] = useState<Deposito[]>(initialDepositos); // <-- MODIFICADO

  const [filters, setFilters] = useState<FiltersState>({ estadoPago: "" }); // <-- MODIFICADO
  
  // ELIMINADO: Estado para el modal de envío
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // const [openShipment, setOpenShipment] = useState(false);

  // Stats
  const stats: Stats = useMemo(() => {
    const totalFacturas = allFacturas.length;
    const facturasPagadas = allFacturas.filter(f => f.saldo === 0).length; // <-- MODIFICADO
    const facturasPendientes = allFacturas.filter(f => f.saldo?? 0).length; // <-- MODIFICADO
    const totalFacturado = allFacturas.reduce((s, f) => s + (f.total ?? 0), 0); // <-- MODIFICADO
    return { totalFacturas, facturasPagadas, facturasPendientes, totalFacturado };
  }, [allFacturas]);

  // Lista filtrada (necesitarás crear 'filterFacturas' basado en 'filterOrders')
  const facturas = useMemo(() => filterFacturas(allFacturas, filters), [allFacturas, filters]); // <-- MODIFICADO

  // Acciones
  const handleViewDetail = (f: Factura) => { // <-- MODIFICADO
    router.push(`/facturas/${f.id}/detalles`); // <-- MODIFICADO
  };

  // ELIMINADO: handleDoShipment
  // ELIMINADO: handleConfirmShipment

  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Gestión de Facturas</span> {/* <-- MODIFICADO */}
      </div>

      {/* Header de la sección */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Gestión de Facturas {/* <-- MODIFICADO */}
          </h2>
          <p className="text-gray-600 text-lg">Gestiona y controla todos los comprobantes de clientes</p> {/* <-- MODIFICADO */}
        </div>
      </div>

      {/* Asumo que crearás este componente basado en VentasStatsCards */}
      <FacturasStatsCards
        totalFacturas={stats.totalFacturas}
        facturasPagadas={stats.facturasPagadas}
        facturasPendientes={stats.facturasPendientes}
        totalFacturado={stats.totalFacturado}
      />

      {/* Asumo que crearás este componente basado en VentasFilters */}
      <FacturasFilters
        value={filters}
        onChange={setFilters}
        onClear={() => setFilters({ estadoPago: "" })}
        onSearch={() => {
          /* Lógica de fetch a /api/facturas con filtros */
        }}
      />

      {/* Asumo que crearás este componente basado en VentasTable */}
      <FacturasTable
        facturas={facturas} // <-- MODIFICADO
        onViewDetail={handleViewDetail}
        // ELIMINADO: onDoShipment
      />

      {/* ELIMINADO: Modal Envío (VentasModal) */}
    </main>
  );
}