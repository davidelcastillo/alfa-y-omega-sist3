// src/mocks/comprobanteProveedorMock.ts
import type {
  Product,
  DetalleComprobanteProveedor,
  ComprobanteProveedor,
  TipoComprobante,
  MetodoPago,
  TipoMovimiento,
  PurchaseOrder,
} from "@/lib/comprobante-proveedor/comprobante";

// Proveedores
export const suppliersMock = [
  { id: "PROV001", name: "Distribuidora Central S.A."},
  { id: "PROV002", name: "Suministros Industriales Ltda."},
];

// Depósitos
export const depositosMock = [
  { id: "DEP001", name: "Depósito Principal" },
  { id: "DEP002", name: "Depósito Secundario" },
];

// Productos
export const productsMock: Product[] = [
  { id: "PROD001", name: "Producto A", code: "PA001", price: 5000 },
  { id: "PROD002", name: "Producto B", code: "PB002", price: 5000 },
  { id: "PROD003", name: "Producto C", code: "PC003", price: 4475 },
];

// Órdenes de compra
export const purchaseOrdersMock: PurchaseOrder[] = [
  {
    id: "OC001",
    supplier: { id: "PROV001", name: "Distribuidora Central S.A." },
  },
];

// Tipos de comprobante (solo id 1,3,4 permitidos)
export const tipoComprobantesMock: TipoComprobante[] = [
  { id: "1", name: "Factura A" },
  { id: "3", name: "Nota de Crédito" },
  { id: "4", name: "Nota de Débito" },
];

// Métodos de pago
export const metodoPagosMock: MetodoPago[] = [
  { id: "1", name: "Transferencia" },
  { id: "2", name: "Efectivo" },
];

// Tipos de movimiento
export const tipoMovimientosMock: TipoMovimiento[] = [
  { id: "1", name: "Ingreso por compra", saldo: true },
  { id: "2", name: "Egreso", saldo: false },
];

// Items de ejemplo
export const detalleComprobanteMock: DetalleComprobanteProveedor[] = [
  { id: "1", productId: "PROD001", productName: "Producto A", quantity: 5, unitPrice: 5000, totalPrice: 25000 },
  { id: "2", productId: "PROD002", productName: "Producto B", quantity: 3, unitPrice: 5000, totalPrice: 15000 },
];

// Comprobante de proveedor ejemplo
export const comprobanteProveedorMock: ComprobanteProveedor = {
  id: "1",
  ordenCompra: purchaseOrdersMock[0],
  proveedor: suppliersMock[0],
  deposito: depositosMock[0],
  letra: "A",
  numeroSucursal: "001",
  numero: "0001-00000001",
  moneda: "ARS",
  tipoComprobante: tipoComprobantesMock[0],
  fecha: new Date().toISOString(),
  hora: "10:45",
  total: 40000,
  saldo: 40000,
  metodoPagoId: metodoPagosMock[0],
  estado: true,
  observaciones: "Comprobante de prueba",
  tipoMovimiento: tipoMovimientosMock[0],
  items: detalleComprobanteMock,
};
