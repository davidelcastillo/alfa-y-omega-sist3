// src/app/compras/actions/create.ts
"use server";

import { revalidatePath } from "next/cache";
import type { PurchaseOrder, PurchaseOrderItem } from "@/lib/compras/purchase";
import { purchaseOrdersMock as mockOrders } from "@/mocks/compras.mock"; // 📍 Re-importamos el mock

// ========= CREAR =========
export async function createOrderAction(payload: {
  proveedorId: string;
  deposito: string;
  fechaEntrega: string; // yyyy-mm-dd
  items: PurchaseOrderItem[];
}): Promise<PurchaseOrder> {
  // 📍 Volvemos a usar la lógica de mock
  const newId = genOCId(mockOrders);
  const now = new Date();
  const creationDate = toDDMMYYYY(
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  );
  const creationTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // En una situación real, esto se haría en el backend
  const totalCantidad = payload.items.reduce((s, i) => s + i.quantity, 0);
  const totalMonto = payload.items.reduce((s, i) => s + i.totalPrice, 0);

  const created: PurchaseOrder = {
    id: newId,
    creationDate,
    creationTime,
    supplier: { id: payload.proveedorId, name: "Proveedor mock", code: "" },
    warehouse: payload.deposito,
    deliveryDate: toDDMMYYYY(payload.fechaEntrega),
    status: "Incompleta",
    total: totalMonto,
    totalQuantity: totalCantidad,
    items: payload.items,
  };

  revalidatePath("/compras");
  return created;
}

// Helpers locales (déjalos)
function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function toDDMMYYYY(yyyy_mm_dd: string) {
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  return `${pad(d)}/${pad(m)}/${y}`;
}
function genOCId(all: PurchaseOrder[]) {
  const nums = all.map((o) => Number(o.id.split("-")[1] || "0")).filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `OC-${String(next).padStart(3, "0")}`;
}