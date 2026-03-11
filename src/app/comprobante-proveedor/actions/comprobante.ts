"use server";

import { revalidatePath } from "next/cache";
import type { ComprobanteProveedor, DetalleComprobanteProveedor } from "@/lib/comprobante-proveedor/comprobante";

// // Base URL de tu API (asegurate de definir NEXT_PUBLIC_BASE_URL en .env)
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

// ===== Listar comprobantes con relaciones =====
export async function listComprobanteAction(): Promise<ComprobanteProveedor[]> {
  const res = await fetch(`http://localhost:3000/api/comprobantes-proveedor?include=proveedor,deposito,ordenCompra,tipoComprobante,metodoPago,tipoMovimiento,items`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("No se pudo listar comprobantes");

  const result = await res.json();
  return result.items; // la API debe devolver { items, meta }
}

// ===== Crear comprobante =====
export async function createComprobanteAction(payload: {
  proveedorId: string;
  depositoId?: string;
  fecha: string;
  letra?: string;
  numeroSucursal?: string;
  numero?: string;
  moneda?: string;
  tipoComprobanteId: string;
  metodoPagoId?: string;
  items: DetalleComprobanteProveedor[];
  observaciones?: string;
}): Promise<ComprobanteProveedor> {
  const res = await fetch(`http://localhost:3000/api/comprobantes-proveedor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("No se pudo crear el comprobante");

  const newComprobante = await res.json();
  revalidatePath("/comprobante-proveedor"); // refresca server component
  return newComprobante;
}
