"use client";

import { useEffect, useMemo, useState } from "react"; // <--- Añadir useEffect
import { useRouter } from "next/navigation";
import VentasStatsCards from "@/components/ventas/VentasStatsCards";
import VentasFilters from "@/components/ventas/VentasFilters";
import VentasTable from "@/components/ventas/VentasTable";
import VentasModal from "@/components/ventas/VentasModal";
import type { Order, Warehouse, FiltersState, Stats } from "@/lib/ventas/types";
import { filterOrders } from "@/lib/ventas/utils";
// Ya no necesitas importar MovimientoPayload aquí si no usas onSubmit
// import { MovimientoPayload } from "@/components/ventas/VentasModal";

// --- TIPO PARA TIPOS DE MOVIMIENTO (AJUSTA SEGÚN TU API REAL) ---
type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };

// Mock data (REEMPLAZA CON FETCH REAL)
// Quita estos mocks si ya obtienes los datos de la API
// const mockTiposMovimiento = [
//  { id: 6, nombre: "Egreso por Venta (Egreso)", saldo: false }, // Asegúrate que 6 sea el ID correcto
//  // ...otros tipos si los necesitas en otro lugar
// ];

type Props = {
  initialOrders: Order[];
  initialWarehouses: Warehouse[]; // ¿Realmente usas esto aquí? Podrías quitarlo si no.
};

export default function VentasClient({ initialOrders, initialWarehouses }: Props) {
  const router = useRouter();

  const [allOrders, setAllOrders] = useState<Order[]>(initialOrders);
  // const [warehouses] = useState<Warehouse[]>(initialWarehouses); // Quitar si no se usa

  const [filters, setFilters] = useState<FiltersState>({ status: "" });
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  const [openMovimientoModal, setOpenMovimientoModal] = useState(false);

  // --- ESTADO PARA TIPOS DE MOVIMIENTO ---
  const [tiposMovimientoList, setTiposMovimientoList] = useState<TipoMovimientoDTO[]>([]);

  // --- FETCH PARA TIPOS DE MOVIMIENTO ---
  useEffect(() => {
    const fetchTiposMovimiento = async () => {
      try {
        const response = await fetch('/api/tipos-movimientos'); // Endpoint de tu API
        if (!response.ok) {
          throw new Error('Error al cargar tipos de movimiento');
        }
        const data = await response.json();
        setTiposMovimientoList(data); // Guardar la lista en el estado
        console.log("Tipos de Movimiento cargados:", data);
      } catch (error) {
        console.error("Error fetching tipos de movimiento:", error);
        // Podrías mostrar un toast de error aquí
        // toast.error("No se pudieron cargar los tipos de movimiento.");
      }
    };

    fetchTiposMovimiento();
  }, []); // Se ejecuta solo una vez al montar el componente

  // --- Cálculos con useMemo (sin cambios) ---
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

  // --- Handlers (sin cambios) ---
  const handleViewDetail = (o: Order) => {
    router.push(`/ventas/${o.id}/detalles`);
  };

  const handleDoShipment = (o: Order) => {
    console.log("Abriendo modal para pedido:", o.orderNumber); // Log para debug
    setSelectedPedidoId(o.orderNumber);
    setOpenMovimientoModal(true);
  };

  // --- Función para refrescar datos (si la necesitas) ---
  const refreshVentasData = async () => {
      console.log("Refrescando datos de ventas...");
      // Aquí deberías volver a llamar a la API que trae `initialOrders`
      // y actualizar el estado `allOrders`
      // Ejemplo (necesitas adaptar la URL y el manejo de datos):
      try {
          // const response = await fetch('/api/ventas'); // O tu endpoint
          // if (!response.ok) throw new Error('Error al recargar ventas');
          // const updatedOrders = await response.json();
          // setAllOrders(updatedOrders);
          router.refresh(); // O simplemente refrescar la ruta si usas Server Actions o similar
          console.log("Datos de ventas refrescados.");
      } catch (error) {
          console.error("Error al refrescar ventas:", error);
          // toast.error("No se pudo actualizar la lista de ventas.");
      }
  };


  return (
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* ... (Breadcrumbs y Título sin cambios) ... */}
       <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-primary-pink font-medium">Gestion de Ventas</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4"> {/* Aumentado mb */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-1"> {/* Ajustado estilo título */}
            Gestión de Ventas
          </h2>
          <p className="text-gray-500 text-base lg:text-lg">Gestiona y controla todos los pedidos de ventas.</p>
        </div>
        {/* Puedes añadir botones de acción aquí si es necesario */}
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
        // onSearch={() => {}} // Quitar si no se usa
      />

      <VentasTable
        orders={orders}
        onViewDetail={handleViewDetail}
        onDoShipment={handleDoShipment}
      />

      {/* --- LLAMADA CORREGIDA A VentasModal --- */}
      <VentasModal
        isOpen={openMovimientoModal}
        onClose={() => {
          console.log("Cerrando modal..."); // Log para debug
          setOpenMovimientoModal(false);
          setSelectedPedidoId(null); // Limpiar ID al cerrar
        }}
        pedidoId={selectedPedidoId}
        tiposMovimiento={tiposMovimientoList} // Pasar la lista obtenida de la API
        refreshVentasData={refreshVentasData} // Pasar la función de refresco
        // ❌ NO PASAR onSubmit
        // ❌ NO PASAR stockIndex
      />
    </main>
  );
}
