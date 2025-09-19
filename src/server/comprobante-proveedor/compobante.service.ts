//Esta carpeta es para traer las llamadas a apis
//Hoy usa mocks; mañana cambiás por fetch() a tu API sin tocar componentes.
import type {
  PurchaseOrder,
  Supplier,
  Product,
  ComprobanteProveedor,
  Deposito,
  TipoComprobante,
  MetodoPago,
  TipoMovimiento,
  DetalleComprobanteProveedor,
  ComprobanteFiltersState
} from "@/lib/comprobante-proveedor/comprobante";


export async function getComprobantes(
  page = 1,
  limit = 20,
  filters?: ComprobanteFiltersState,
  sort?: string
): Promise<{ items: ComprobanteProveedor[]; meta: any }> {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (filters?.proveedorId) params.set("proveedorId", filters.proveedorId);
  if (filters?.fechaDesde) params.set("fecha_desde", filters.fechaDesde);
  if (filters?.fechaHasta) params.set("fecha_hasta", filters.fechaHasta);
  if (filters?.numeroCP) params.set("numero", filters.numeroCP);
  if (sort) params.set("sort", sort);

  const res = await fetch(`/api/comprobantes-proveedor?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "No se pudo obtener los comprobantes");
  }
  return res.json();
}

export async function createComprobanteAction(payload: {
  ordenCompraId: number;
  proveedorId: number;
  depositoId?: number;
  fecha: string;
  letra?: string;
  numeroSucursal?: string;
  numero?: string;
  tipoComprobanteId: number;
  metodoPagoId?: number;
  tipoMovimientoId?: number;
  observaciones?: string;
  detalles: {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    descuento?: number;
    observaciones?: string;
  }[];
}): Promise<{ comprobante: ComprobanteProveedor; movimiento: any }> {
  const res = await fetch("/api/comprobantes-proveedor/nuevo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Error creando comprobante");
  return data.data;
}

// =========================
// PROVEEDORES
// =========================
export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch("/api/proveedores", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener proveedores");
  return res.json();
}

// =========================
// PRODUCTOS
// =========================
export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/productos", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener productos");
  return res.json();
}

// =========================
// DEPOSITOS
// =========================
export async function getDepositos(): Promise<Deposito[]> {
  const res = await fetch("/api/depositos", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener depósitos");
  return res.json();
}

// =========================
// TIPOS DE COMPROBANTE
// =========================
export async function getTipoComprobantes(): Promise<TipoComprobante[]> {
  const res = await fetch("/api/tipo-comprobantes", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener tipos de comprobante");
  return res.json();
}

// =========================
// METODOS DE PAGO
// =========================
export async function getMetodoPagos(): Promise<MetodoPago[]> {
  const res = await fetch("/api/metodos-pago", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener métodos de pago");
  return res.json();
}

// =========================
// TIPOS DE MOVIMIENTO
// =========================
export async function getTipoMovimientos(): Promise<TipoMovimiento[]> {
  const res = await fetch("/api/tipo-movimientos", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener tipos de movimiento");
  return res.json();
}

// =========================
// ORDENES DE COMPRA
// =========================
export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const res = await fetch("/api/ordenes-compra", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener órdenes de compra");
  return res.json();
}
