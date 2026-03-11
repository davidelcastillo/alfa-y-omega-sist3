// src/app/compras/actions/orders.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";                   // 🟢 usamos BD real
import type { PurchaseOrder, PurchaseOrderItem } from "@/lib/compras/purchase";
// import { purchaseOrdersMock as mockOrders, suppliersMock as mockSuppliers } from "@/mocks/compras.mock"; // 🔴 ya no usamos mocks

// ========= LISTAR =========
export async function listOrdersAction(): Promise<PurchaseOrder[]> {
  // En real: tu página ya usa getPurchaseOrders() desde server/compras.service.ts,
  // así que esta action puede no usarse. La dejamos por compatibilidad.
  // Si quisieras, podés leer desde tu API/servicio aquí también.
  return [];
}

/* ========= Helpers locales ========= */
function pad(n: number) { return n.toString().padStart(2, "0"); }
function toDDMMYYYY(yyyy_mm_dd: string) {
  if (!yyyy_mm_dd) return "";
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  return `${pad(d)}/${pad(m)}/${y}`;
}
function formatDDMMYYYY(d: string | Date) {
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * ========= CREAR =========
 * Crea una OC en BD y devuelve un objeto NORMALIZADO con el mismo shape
 * que usa la tabla (PurchaseOrder del front).
 *
 * Notas:
 * - El modal te manda `proveedorId` (string), `deposito` (NOMBRE del depósito),
 *   `fechaEntrega` (yyyy-mm-dd) e `items`.
 * - Aún no persistimos detalles (items) hasta tener productId real del typeahead.
 *   Igual devolvemos los items para que la UI muestre totales coherentes.
 */
export async function createOrderAction(payload: {
  proveedorId: string;
  deposito: string;              // nombre del depósito
  fechaEntrega: string;          // yyyy-mm-dd
  items: PurchaseOrderItem[];
  totalCantidad?: number;        // 🟢 opcional: si no viene, lo calculamos
  totalMonto?: number;           // 🟢 opcional: si no viene, lo calculamos
}): Promise<PurchaseOrder> {

  // 🟢 Normalizamos totales si no vinieron calculados
  const totalCantidad =
    payload.totalCantidad ??
    payload.items.reduce((s, i) => s + Number(i.quantity || 0), 0);

  const totalMonto =
    payload.totalMonto ??
    payload.items.reduce((s, i) => s + Number(i.totalPrice || 0), 0);

  // 🟢 Validaciones mínimas
  const proveedorIdNum = Number(payload.proveedorId || 0);
  if (!proveedorIdNum) throw new Error("Proveedor inválido");

  // 🟢 Resolver depositoId a partir del NOMBRE (no tocamos schema)
  const dep = await prisma.deposito.findFirst({
    where: { nombre: payload.deposito },
    select: { id: true, nombre: true },
  });
  const depositoId = dep?.id ?? null;

  // 🟢 Crear OC (por ahora sin detalles; cuando tengamos typeahead con productId real, se agregan)
  const now = new Date();
  const oc = await prisma.ordenCompra.create({
    data: {
      fecha: now,
      hora: "", // si querés, guardá hora real
      nroOC: null,
      proveedorId: proveedorIdNum,
      depositoId: depositoId ?? undefined,
      subTotal: totalMonto,
      otrosGastos: 0,
      total: totalMonto,
      fechaEntrega: payload.fechaEntrega ? new Date(payload.fechaEntrega) : null,
      estado: true, // o false si tu lógica considera "Incompleta" al crear
      observaciones: null,
    },
    select: {
      id: true,
      fecha: true,
      hora: true,
      proveedor: { select: { id: true, nombre: true } },
      depositoId: true,
      total: true,
      estado: true,
      _count: { select: { detalleOrdenCompra: true } },
    },
  });

  // 🟢 Mapa id→nombre de depósitos para armar `warehouse` (igual que en el listado)
  const depositos = await prisma.deposito.findMany({
    select: { id: true, nombre: true },
  });
  const depositoMap = new Map(depositos.map((d) => [d.id, d.nombre]));

  // 🟢 NORMALIZACIÓN al shape de la tabla
  const created: PurchaseOrder = {
    id: String(oc.id),
    creationDate: formatDDMMYYYY(oc.fecha),
    creationTime: String(oc.hora ?? ""),
    supplier: {
      id: String(oc.proveedor.id),
      name: String(oc.proveedor.nombre ?? "—"),
      code: "",
    },
    warehouse: oc.depositoId ? (depositoMap.get(oc.depositoId) ?? "—") : "—",
    deliveryDate: payload.fechaEntrega ? toDDMMYYYY(payload.fechaEntrega) : "",
    status: oc.estado ? "Completa" : "Incompleta",
    total: Number(oc.total ?? 0),
    totalQuantity: Number(totalCantidad),
    items: Array.isArray(payload.items) ? payload.items : [],
  };

  // Opcional: revalidar página de compras si usás caché
  revalidatePath("/compras");

  return created;
}
