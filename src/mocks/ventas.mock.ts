// src/mocks/ventas.mock.ts
import type { Order, Warehouse } from "@/lib/ventas/types";

export const warehousesMock: Warehouse[] = [
  {
    id: "DEP001",
    name: "Depósito Central",
    products: [
      { id: "PROD001", name: "Producto A", stock: 100, price: 5000 },
      { id: "PROD002", name: "Producto B", stock: 50, price: 7500 },
      { id: "PROD003", name: "Producto C", stock: 75, price: 3000 },
    ],
  },
  {
    id: "DEP002",
    name: "Depósito Norte",
    products: [
      { id: "PROD001", name: "Producto A", stock: 80, price: 5000 },
      { id: "PROD002", name: "Producto B", stock: 30, price: 7500 },
      { id: "PROD004", name: "Producto D", stock: 60, price: 4500 },
    ],
  },
  {
    id: "DEP003",
    name: "Depósito Sur",
    products: [
      { id: "PROD003", name: "Producto C", stock: 90, price: 3000 },
      { id: "PROD004", name: "Producto D", stock: 40, price: 4500 },
      { id: "PROD005", name: "Producto E", stock: 55, price: 6000 },
    ],
  },
];

export const ordersMock: Order[] = [
  {
    id: "1",
    orderNumber: "PED-001",
    orderDate: "2024-01-15",
    orderTime: "14:30:00",
    customerName: "Juan Pérez",
    totalProducts: 25,
    cardNumber: "**** **** **** 1234",
    total: 125000,
    status: "Pendiente de enviar",
    products: [
      { id: "1", name: "Producto A", quantity: 10, unitPrice: 5000, subtotal: 50000 },
      { id: "2", name: "Producto B", quantity: 10, unitPrice: 7500, subtotal: 75000 },
    ],
    history: [{ date: "2024-01-15 14:30", action: "Pedido creado", user: "Sistema" }],
  },
  {
    id: "2",
    orderNumber: "PED-002",
    orderDate: "2024-01-16",
    orderTime: "09:15:00",
    customerName: "María González",
    totalProducts: 30,
    cardNumber: "**** **** **** 5678",
    total: 225000,
    status: "Enviado",
    shippedDate: "2024-01-17",
    warehouse: "Depósito Central",
    products: [
      { id: "3", name: "Producto C", quantity: 20, unitPrice: 3000, subtotal: 60000 },
      { id: "4", name: "Producto D", quantity: 10, unitPrice: 4500, subtotal: 45000 },
      { id: "5", name: "Producto E", quantity: 20, unitPrice: 6000, subtotal: 120000 },
    ],
    history: [
      { date: "2024-01-16 09:15", action: "Pedido creado", user: "Sistema" },
      { date: "2024-01-17 11:20", action: "Pedido enviado desde Depósito Central", user: "Carlos López" },
    ],
  },
  {
    id: "3",
    orderNumber: "PED-003",
    orderDate: "2024-01-17",
    orderTime: "11:20:00",
    customerName: "Carlos Rodríguez",
    totalProducts: 15,
    cardNumber: "**** **** **** 9012",
    total: 100000,
    status: "Pendiente de enviar",
    products: [
      { id: "6", name: "Producto A", quantity: 10, unitPrice: 5000, subtotal: 50000 },
      { id: "7", name: "Producto C", quantity: 5, unitPrice: 3000, subtotal: 15000 },
      { id: "8", name: "Producto E", quantity: 5, unitPrice: 7000, subtotal: 35000 },
    ],
    history: [{ date: "2024-01-17 11:20", action: "Pedido creado", user: "Sistema" }],
  },
];
