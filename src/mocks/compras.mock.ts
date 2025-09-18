//esto se puede borrar cuando ya este listo compras gestion de compras
import type { PurchaseOrder, Supplier, Product } from "@/lib/compras/purchase"

export const suppliersMock: Supplier[] = [
  { id: "PROV001", name: "Distribuidora Central S.A.", code: "DC001", email: "ventas@distribuidora.com", phone: "+54 11 4567-8900" },
  { id: "PROV002", name: "Suministros Industriales Ltda.", code: "SI002", email: "pedidos@suministros.com", phone: "+54 11 4567-8901" },
]

export const productsMock: Product[] = [
  { id: "PROD001", name: "Producto A", code: "PA001", price: 5000 },
  { id: "PROD002", name: "Producto B", code: "PB002", price: 5000 },
  { id: "PROD003", name: "Producto C", code: "PC003", price: 4475 },
]

export const purchaseOrdersMock: PurchaseOrder[] = [
  {
    id: "OC-001",
    creationDate: "15/01/2024",
    creationTime: "10:30",
    supplier: { id: "PROV001", name: "Distribuidora Central S.A.", code: "DC001" },
    warehouse: "Depósito Principal",
    deliveryDate: "20/01/2024",
    status: "Incompleta",
    total: 125000,
    totalQuantity: 25,
    items: [
      { id: "1", productId: "PROD001", productName: "Producto A", quantity: 10, unitPrice: 5000, totalPrice: 50000 },
      { id: "2", productId: "PROD002", productName: "Producto B", quantity: 15, unitPrice: 5000, totalPrice: 75000 },
    ],
  },
  {
    id: "OC-002",
    creationDate: "14/01/2024",
    creationTime: "09:15",
    supplier: { id: "PROV002", name: "Suministros Industriales Ltda.", code: "SI002" },
    warehouse: "Depósito Secundario",
    deliveryDate: "18/01/2024",
    status: "Completa",
    total: 89500,
    totalQuantity: 20,
    items: [
      { id: "3", productId: "PROD003", productName: "Producto C", quantity: 20, unitPrice: 4475, totalPrice: 89500 },
    ],
  },
]

export const depositosMocks = ["Depósito Principal", "Depósito Secundario"];
