// src/lib/ventas/types.ts
export type OrderProduct = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type HistoryEvent = {
  date: string;
  action: string;
  user: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  orderDate: string; // YYYY-MM-DD
  orderTime: string; // HH:mm:ss
  customerName: string;
  totalProducts: number;
  cardNumber: string;
  total: number;
  status: "Enviado" | "Pendiente de enviar";
  shippedDate?: string;
  products: OrderProduct[];
  history: HistoryEvent[];
  warehouse?: string;
};

export type WarehouseProduct = { id: string; name: string; stock: number; price: number };
export type Warehouse = { id: string; name: string; products: WarehouseProduct[] };

export type FiltersState = {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  orderNumber?: string;
  status?: "" | "Enviado" | "Pendiente de enviar";
};

export type ShipmentPayload = {
  orderId: string;
  warehouseId: string;
  products: OrderProduct[];
  total: number;
};

export type Stats = {
  totalOrders: number;
  shippedOrders: number;
  pendingOrders: number;
  balance: number;
};
