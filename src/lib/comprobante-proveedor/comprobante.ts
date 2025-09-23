// src/lib/compras/purchase.ts


export type Supplier = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  code?: string;
  price?: number;
};

export type Deposito = {
  id: string;
  name: string;
};

export type PurchaseOrderItem = {
  id: string;
  productId: string;
  productName: string;
  cantidad?: number;
  precioUnitario?: number;
  total?: number;
};

export type PurchaseOrder = {
  id: string;
  supplier?: { id: string; name: string } | null;
  deposito?: { id: string; name: string } | null;
  status?: boolean | null;
  items?: PurchaseOrderItem[];
};

export type TipoMovimiento = {
  id: string;
  name: string;
  saldo: boolean;
};

export type TipoComprobante = {
  id: string;
  name: string;
};

export type MetodoPago = {
  id: string;
  name: string;
};

export type DetalleComprobanteProveedor = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  observations?: string;
};

export type ComprobanteProveedor = {
  id: string;
  nroComprobante?: string | null;
  ordenCompra?: PurchaseOrder | null;
  proveedor: Supplier;
  deposito?: Deposito | null;

  letra?: string | null;
  numeroSucursal?: string | null;
  numero?: string | null;
  moneda?: string | null;

  tipoComprobante?: TipoComprobante | null;

  fecha?: string | null; // ISO string
  hora?: string | null;

  total: number;
  saldo: number;

  metodoPago?: MetodoPago | null;

  estado?: boolean | null;
  observaciones?: string | null;

  tipoMovimiento?: TipoMovimiento | null;

  items?: DetalleComprobanteProveedor[];
};

// Filtros
export type ComprobanteFiltersState = {
  fechaDesde?: string; // yyyy-mm-dd
  fechaHasta?: string; // yyyy-mm-dd
  numeroCP?: string;
  proveedorId?: string;
  depositoId?: string;
};

// Ordenamiento
export type SortKey = 
  | "id"
  | "ordenCompra"  
  | "fecha"
  | "hora"
  | "numero"
  | "numeroSucursal"
  | "letra"
  | "moneda"
  | "total"
  | "saldo"
  | "estado"
  | "proveedor"   // ojo: acá después aclaramos que es por nombre
  | "deposito"    // idem
  | "tipoComprobante"
  | "tipoMovimiento";
export type SortState = { key: SortKey; dir: "asc" | "desc" };
