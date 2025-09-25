// src/app/compras/actions/orders.ts
"use server";

import { revalidatePath } from "next/cache";
import type { PurchaseOrder, PurchaseOrderItem } from "@/lib/compras/purchase";
import { purchaseOrdersMock as mockOrders, suppliersMock as mockSuppliers } from "@/mocks/compras.mock";

// ========= LISTAR =========
export async function listOrdersAction(): Promise<PurchaseOrder[]> {
  // En real: fetch a tu API (sin cache) y retornar JSON
  // const res = await fetch(`${process.env.API_URL}/compras`, { cache: "no-store" });
  // if (!res.ok) throw new Error("No se pudo listar órdenes");
  // return res.json();
  return mockOrders;
}

