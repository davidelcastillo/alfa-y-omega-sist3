// src/lib/compras/purchase.ts
export type PurchaseStatus = "Completa" | "Incompleta";

export type Supplier = {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
};

export type Product = {
  id: string;
  name: string;
  code: string;
  price: number;
};

export type PurchaseOrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type PurchaseOrder = {
  id: string;
  creationDate: string;   // dd/mm/yyyy (mock como tu HTML)
  creationTime: string;   // hh:mm
  supplier: { id: string; name: string; code: string };
  warehouse: string;
  warehouseId?: string;       // 👈 nuevo
  deliveryDate: string;   // dd/mm/yyyy
  status: PurchaseStatus;
  total: number;
  totalQuantity: number;
  items: PurchaseOrderItem[];
};

// Filtros
export type ComprasFiltersState = {
  fechaDesde?: string; // yyyy-mm-dd
  fechaHasta?: string; // yyyy-mm-dd
  numeroOC?: string;
  proveedorId?: string;
  depositoId?: string;   // ← nuevo: filtrar por ID de depósito
  deposito?: string;     // ← opcional/legacy (por nombre). Puedes quitarlo si ya no lo usas.
};

// Ordenamiento
export type SortKey = "id" | "creationDate" | "supplier" | "warehouse" | "total" | "status";
export type SortState = { key: SortKey; dir: "asc" | "desc" };
