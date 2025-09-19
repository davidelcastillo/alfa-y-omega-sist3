
"use server";

import { revalidatePath } from "next/cache";
import type { ComprobanteProveedor,
              DetalleComprobanteProveedor,
              TipoComprobante,
              MetodoPago,
              TipoMovimiento, 
            } from "@/lib/comprobante-proveedor/comprobante";
import {  comprobanteProveedorMock as mockComprobante,
  suppliersMock as mockSuppliers,
  depositosMock as mockDepositos,
  tipoComprobantesMock as mockTipoComprobantes,
  metodoPagosMock as mockMetodos,
  tipoMovimientosMock as mockMovimientos, 
} from "@/mocks/comprobante.mock";

// ========= LISTAR =========
export async function listComprobanteAction(): Promise<ComprobanteProveedor[]> {
  // En real: fetch a tu API (sin cache) y retornar JSON
  // const res = await fetch(`${process.env.API_URL}/compras`, { cache: "no-store" });
  // if (!res.ok) throw new Error("No se pudo listar órdenes");
  // return res.json();
  return [mockComprobante];
}

// ========= CREAR =========
export async function createComprobanteAction(payload: {
  proveedorId: string;
  depositoId: string;
  fecha: string; // yyyy-mm-dd
  letra?: string;
  numeroSucursal?: string;
  numero: string;
  moneda?: string;
  tipoComprobanteId: string; // solo 1,3,4 permitidos
  metodoPagoId: string;
  items: DetalleComprobanteProveedor[];
}): Promise<ComprobanteProveedor> {
  // En real: POST a tu API, obtendrás el objeto creado
  // Demo con mocks:
  const proveedor = mockSuppliers.find((s) => s.id === payload.proveedorId)!;
  const deposito = mockDepositos.find((d) => d.id === payload.depositoId)!;
  const tipoComprobante = mockTipoComprobantes.find((t) => t.id === payload.tipoComprobanteId)!;
  const metodoPago = mockMetodos.find((m) => m.id === payload.metodoPagoId)!;
  const tipoMovimiento = mockMovimientos.find((t) => t.id === "1")!; // ingreso por compra con saldo true

  const totalCantidad = payload.items.reduce((s, i) => s + i.quantity, 0);
  const totalMonto = payload.items.reduce((s, i) => s + i.totalPrice, 0);
  const created: ComprobanteProveedor = {
     id: `CP-${Date.now()}`, // id mock
    ordenCompra: {
      id: "OC-MOCK", // si no viene orden de compra real
      supplier: proveedor,
    },
    proveedor,
    deposito,
    letra: payload.letra ?? null,
    numeroSucursal: payload.numeroSucursal ?? null,
    numero: payload.numero,
    moneda: payload.moneda ?? "ARS",
    tipoComprobante,
    fecha: new Date(payload.fecha).toISOString(),
    hora: new Date().toISOString().split("T")[1].slice(0, 5),
    total: totalMonto,
    saldo: totalMonto,
    metodoPagoId: metodoPago,
    estado: true,
    observaciones: null,
    tipoMovimiento,
    items: payload.items,
  };

  // En mocks no persistimos; con API real persistís y revalidás:
  revalidatePath("/comprobante-proveedor");
  return created;
}



// Helpers locales
function pad(n: number) { return n.toString().padStart(2, "0"); }
function toDDMMYYYY(yyyy_mm_dd: string) {
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  return `${pad(d)}/${pad(m)}/${y}`;
}
function genCPId(all: ComprobanteProveedor[]) {
  const nums = all.map((o) => Number(o.id.split("-")[1] || "0")).filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `OC-${String(next).padStart(3, "0")}`;
}
