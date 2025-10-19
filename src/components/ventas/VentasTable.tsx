"use client";

import Button from "@/components/ui/Button";
import { Eye, Truck, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { moneyAR } from "@/lib/format/money";


type OrderProduct = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

type Order = {
  id: string;
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  totalProducts: number;
  cardNumber: string;
  total: number;
  status: "Enviado" | "Pendiente de enviar" | "En Preparación";                 //modificar aqui si es necesario otro estado
  shippedDate?: string;
  products: OrderProduct[];
  history: { date: string; action: string; user: string }[];
  warehouse?: string;
};

type SortKey =
  | "orderNumber"
  | "fecha"          // combina fecha y hora
  | "customerName"
  | "totalProducts"
  | "cardNumber"
  | "total"
  | "status";

export type SortState = { key: SortKey; dir: "asc" | "desc" };

type VentasTableProps = {
  orders: Order[];
  onViewDetail?: (order: Order) => void;
  onDoShipment?: (order: Order) => void;
  // Opcionales para ordenar (matching ComprasTable UX)
  onSort?: (s: SortState) => void;
  sortState?: SortState;
};

export default function VentasTable({
  orders,
  onViewDetail,
  onDoShipment,
  onSort,
  sortState,
}: VentasTableProps) {
  function headerCell(k: SortKey, label: string) {
    const active = sortState?.key === k;
    const dir = sortState?.dir ?? "asc";
    const nextDir: "asc" | "desc" = active && dir === "asc" ? "desc" : "asc";
    const Icon = !active ? ChevronsUpDown : dir === "asc" ? ChevronUp : ChevronDown;
    const ariaSort = active ? (dir === "asc" ? "ascending" : "descending") : "none";

    return (
      <th
        scope="col"
        aria-sort={ariaSort}
        className="px-6 py-4 text-left text-sm font-bold text-blue-800"
      >
        <button
          type="button"
          onClick={() => onSort?.({ key: k, dir: nextDir })}
          className="inline-flex items-center gap-1 select-none hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-pink)] rounded"
        >
          <span>{label}</span>
          <Icon className="w-4 h-4" aria-hidden />
        </button>
      </th>
    );
  }

  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover border">
      <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
        <h3 className="text-xl font-bold text-white">Lista de Pedidos</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headerCell("orderNumber", "Número de pedido")}
              {headerCell("fecha", "Fecha y hora")}
              {headerCell("customerName", "Cliente")}
              {headerCell("totalProducts", "Cantidad total")}
              {headerCell("cardNumber", "Tarjeta")}
              {headerCell("total", "Total")}
              {headerCell("status", "Estado")}
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-800">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 font-semibold text-blue-800">{order.orderNumber}</td>

                <td className="px-6 py-4 text-gray-700">
                  <div className="font-medium">{order.orderDate}</div>
                  <div className="text-sm text-gray-500">{order.orderTime}</div>
                </td>

                <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[24ch]">
                  {order.customerName}
                </td>

                <td className="px-6 py-4 text-gray-700 text-center">{order.totalProducts}</td>

                <td className="px-6 py-4 text-gray-700 text-center">{order.cardNumber}</td>

                <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                  {moneyAR(order.total)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Enviado"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Ver detalle"
                      aria-label={`Ver ${order.orderNumber}`}
                      onClick={() => onViewDetail?.(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {order.status === "En Preparación" && (       //si muestra otro estado modificar aqui, a "Pndiente de enviar"
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Realizar envío"
                        aria-label={`Realizar envío de ${order.orderNumber}`}
                        onClick={() => onDoShipment?.(order)}
                      >
                        <Truck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  No hay pedidos para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
