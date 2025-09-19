// src/lib/compras/purchase.ts


export type Supplier = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  code: string;
  price: number;
};

export type Deposito = {
  id: string;
  name: string;
};

export type PurchaseOrder = {
  id: string;
  supplier: { id: string; name: string;};
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
  ordenCompra : PurchaseOrder;
  proveedor:  { id: string; name: string};
  deposito: { id: string; name: string};

  letra?: string | null;
  numeroSucursal?: string | null;
  numero: string;
  moneda?: string | null;

  tipoComprobante: TipoComprobante;

  fecha: string; // ISO string
  hora?: string | null;

  total: number;
  saldo: number;

  metodoPagoId?: MetodoPago;

  estado: boolean;
  observaciones?: string | null;

  tipoMovimiento: TipoMovimiento;

  items: DetalleComprobanteProveedor[];
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
