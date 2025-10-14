// src/server/ventas.service.ts
import { ordersMock, warehousesMock } from "@/mocks/ventas.mock";
import type { FiltersState, Order, Warehouse } from "@/lib/ventas/types";
import { filterOrders } from "@/lib/ventas/utils";

export async function getInitialVentasData(): Promise<{
  orders: Order[];
  warehouses: Warehouse[];
}> {
  // En el futuro: fetch a tu API/DB
  return {
    orders: ordersMock,
    warehouses: warehousesMock,
  };
}

export async function listOrders(filters?: FiltersState): Promise<Order[]> {
  const base = ordersMock;
  return filters ? filterOrders(base, filters) : base;
}

export async function listWarehouses(): Promise<Warehouse[]> {
  return warehousesMock;
}
