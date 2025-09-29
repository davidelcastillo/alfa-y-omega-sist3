// src/server/compras/compras.service.ts
//Esta carpeta es para traer las llamadas a apis
//Hoy usa mocks; mañana cambiás por fetch() a tu API sin tocar componentes.
import "server-only";
import { suppliersMock, productsMock } from "@/mocks/compras.mock"
import type { PurchaseOrder, Supplier, Product } from "@/lib/compras/purchase"
//import { sleep } from "@/lib/compras/utils"

type GetOCParams = {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  estado?: boolean;
  proveedorId?: number;
  depositoId?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
};

function getBaseUrl() {  //no se que hace esto, ver y capaz borrar si hace falta
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

//Asocio con la api de ordenes de compra
export async function getPurchaseOrders(params: GetOCParams = {}): Promise<PurchaseOrder[]> {
  const base = getBaseUrl();
  const url = new URL("/api/ordenes-compra", base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /ordenes-compra ${res.status}`);

  const json = await res.json();
  const rows = Array.isArray(json) ? json : (json.data ?? []); // <-- tu API usa "data"

  return rows.map(mapApiToPurchaseOrder);
}

/* ---------- Mapper DB/API -> UI ---------- */
function mapApiToPurchaseOrder(row: any): PurchaseOrder {
  // 🔁 MODIFICADO: la API envía `fecha` (ISO), no `fecha_creacion`
  const creationDate = formatDDMMYYYY(row.fecha);

  return {
    id: String(row.id),
    creationDate,
    creationTime: String(row.hora ?? ""), // 🟢 AGREGADO: hora si llega, sino vacío

    // 🔁 MODIFICADO: proveedor llega como objeto { id, nombre }
    supplier: {
      id: String(row.proveedor?.id ?? ""),     // 🔁 antes tomaba proveedorId
      name: String(row.proveedor?.nombre ?? "—"), // 🔁 antes tomaba "proveedor" como string
      code: "",                                 // (lo dejás vacío si no lo usás)
      // email y phone estaban comentados en tu proyecto por compatibilidad de tipos
      // email: "",
      // phone: "",
    },

    // 🔁 MODIFICADO: ahora viene `warehouse` desde el service de órdenes (nombre del depósito)
    warehouse: String(row.warehouse ?? "—"),

    // Si no usás fecha de entrega real aún, dejalo vacío
    deliveryDate: "",

    // 🔁 MODIFICADO: la API envía `estado: boolean`
    status: row.estado ? "Completa" : "Incompleta",

    total: Number(row.total ?? 0),

    // Estos campos dependen de si los estás trayendo. Los dejamos coherentes con tu tipo.
    totalQuantity: Number(row.totalQuantity ?? 0),
    items: Array.isArray(row.items) ? row.items : [],
  };
}

function formatDDMMYYYY(d: string | Date) {
  const date = d instanceof Date ? d : new Date(d);
  // Manejo defensivo por si d es null/undefined o inválido
  if (isNaN(date.getTime())) return ""; // 🟢 AGREGADO: evita NaN/NaN/NaN
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function getSuppliers(): Promise<Supplier[]> {
  //await sleep(50)
  return suppliersMock
}

export async function getProducts(): Promise<Product[]> {
  //await sleep(50)
  return productsMock
}
