import type {
  ComprobanteProveedor,
  Deposito,
  DetalleComprobanteProveedor,
  MetodoPago,
  PurchaseOrder,
  Supplier,
  TipoComprobante,
  TipoMovimiento,
} from "./comprobante";

type UnknownRecord = Record<string, unknown>;

function toRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function pickRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function toStringId(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function takeString(...candidates: Array<unknown>): string | undefined {
  for (const candidate of candidates) {
    const str = toStringId(candidate);
    if (str) return str;
  }
  return undefined;
}

export function normalizeSupplier(raw: unknown): Supplier {
  const input = toRecord(raw);
  const id = toStringId(
    input.id ?? input.proveedorId ?? input.supplierId ?? input.value ?? ""
  );
  const name =
    takeString(
      input.name,
      input.nombre,
      input.razonSocial,
      input.razon_social,
      input.nombreCompleto,
      input.descripcion,
    ) ?? (id ? `Proveedor ${id}` : "Proveedor");
  return { id, name };
}

export function normalizeDeposito(raw: unknown): Deposito {
  const input = toRecord(raw);
  const id = toStringId(input.id ?? input.depositoId ?? "");
  const name =
    takeString(input.name, input.nombre, input.deposito) ??
    (id ? `Depósito ${id}` : "Depósito");
  return { id, name };
}

function normalizeDetalle(raw: unknown, index: number): DetalleComprobanteProveedor {
  const det = toRecord(raw);
  const productId = toStringId(det.productoId ?? det.productId ?? index, String(index));
  const producto = pickRecord(det.producto);
  const productName =
    takeString(
      producto?.nombre,
      det.productoNombre,
      det.productName,
      det.producto,
      det.nombre,
    ) ?? `Producto ${productId || index + 1}`;

  const quantity = toNumber(det.cantidad ?? det.quantity ?? 0, 0);
  const unitPrice = toNumber(det.precioUnitario ?? det.unitPrice ?? 0, 0);
  const totalPrice = toNumber(
    det.totalPrice ?? det.precioXCantidad ?? quantity * unitPrice,
    quantity * unitPrice,
  );

  return {
    id: toStringId(det.id ?? `${productId}-${index}`),
    productId,
    productName,
    quantity,
    unitPrice,
    totalPrice,
    discount: det.descuento as number | undefined ?? (det.discount as number | undefined),
    observations: (det.observaciones as string | undefined) ?? (det.observations as string | undefined),
  };
}

export function normalizeTipoComprobante(raw: unknown): TipoComprobante {
  const input = toRecord(raw);
  return {
    id: toStringId(input.id ?? input.tipoComprobanteId ?? input.value ?? ""),
    name: takeString(input.name, input.nombre, input.descripcion) ?? "Tipo de comprobante",
  };
}

export function normalizeMetodoPago(raw: unknown): MetodoPago {
  const input = toRecord(raw);
  return {
    id: toStringId(input.id ?? input.metodoPagoId ?? input.value ?? ""),
    name: takeString(input.name, input.nombre, input.descripcion) ?? "Método de pago",
  };
}

export function normalizeTipoMovimiento(raw: unknown): TipoMovimiento {
  const input = toRecord(raw);
  return {
    id: toStringId(input.id ?? input.tipoMovimientoId ?? ""),
    name: takeString(input.name, input.nombre) ?? "Movimiento",
    saldo: Boolean(
      input.saldo ?? input.esIngreso ?? true,
    ),
  };
}

export function normalizePurchaseOrder(raw: unknown): PurchaseOrder {
  const input = toRecord(raw);
  const supplier = pickRecord(input.supplier)
    ? normalizeSupplier(input.supplier)
    : pickRecord(input.proveedor)
    ? normalizeSupplier({ id: input.proveedorId, nombre: input.proveedor })
    : input.proveedorId
    ? normalizeSupplier({ id: input.proveedorId })
    : undefined;

  const deposito = pickRecord(input.deposito)
    ? normalizeDeposito(input.deposito)
    : input.depositoId
    ? normalizeDeposito({ id: input.depositoId, nombre: input.depositoNombre })
    : undefined;

  const rawItems = Array.isArray(input.items) ? input.items : undefined;
  const items = rawItems?.map((item, idx) => {
    const itemRecord = toRecord(item);
    const producto = pickRecord(itemRecord.producto);
    return {
      id: toStringId(itemRecord.id ?? `${input.id ?? "oc"}-${idx}`),
      productId: toStringId(itemRecord.productoId ?? itemRecord.productId ?? idx, String(idx)),
      productName:
        takeString(
          producto?.nombre,
          itemRecord.productName,
          itemRecord.productoNombre,
          itemRecord.producto,
        ) ?? `Producto ${idx + 1}`,
      cantidad: toNumber(itemRecord.cantidad ?? itemRecord.quantity ?? 0, 0),
      precioUnitario: toNumber(itemRecord.precioUnitario ?? itemRecord.unitPrice ?? 0, 0),
      total: toNumber(itemRecord.total ?? itemRecord.precioXCantidad ?? 0, 0),
    };
  });

  return {
    id: toStringId(input.id ?? input.ordenCompraId ?? input.nro ?? input.nroOC ?? ""),
    supplier,
    deposito,
    status: (input.estado as boolean | undefined) ?? (input.status as boolean | undefined) ?? null,
    items,
  };
}

export function normalizeComprobante(raw: unknown): ComprobanteProveedor {
  const input = toRecord(raw);
  const proveedor = normalizeSupplier(
    pickRecord(input.proveedor) ?? { id: input.proveedorId, nombre: input.proveedorNombre }
  );

  const deposito = pickRecord(input.deposito)
    ? normalizeDeposito(input.deposito)
    : input.depositoId
    ? normalizeDeposito({ id: input.depositoId, nombre: input.depositoNombre })
    : null;

  const tipoComprobante = pickRecord(input.tipoComprobante)
    ? normalizeTipoComprobante(input.tipoComprobante)
    : input.tipo_comprobante
    ? normalizeTipoComprobante({ id: input.tipoComprobanteId, nombre: input.tipo_comprobante })
    : null;

  const metodoPago = pickRecord(input.metodoPago)
    ? normalizeMetodoPago(input.metodoPago)
    : null;

  const tipoMovimiento = pickRecord(input.tipoMovimiento)
    ? normalizeTipoMovimiento(input.tipoMovimiento)
    : input.tipo_movimiento
    ? normalizeTipoMovimiento({ id: input.tipoMovimientoId, nombre: input.tipo_movimiento })
    : null;

  const ordenCompra = pickRecord(input.ordenCompra)
    ? normalizePurchaseOrder(input.ordenCompra)
    : null;

  const detalles = Array.isArray(input.items)
    ? input.items
    : Array.isArray(input.detalleComprobante)
    ? input.detalleComprobante
    : [];

  return {
    id: toStringId(input.id ?? ""),
    nroComprobante: input.nro_comprobante
      ? toStringId(input.nro_comprobante)
      : toStringId(input.nroComprobante ?? "" ) || null,
    ordenCompra,
    proveedor,
    deposito,
    letra: (input.letra as string | null | undefined) ?? null,
    numeroSucursal: (input.numeroSucursal as string | null | undefined) ?? null,
    numero: input.numero ? toStringId(input.numero) : input.nro_comprobante ? toStringId(input.nro_comprobante) : null,
    moneda: (input.moneda as string | null | undefined) ?? null,
    tipoComprobante,
    fecha: input.fecha ? new Date(String(input.fecha)).toISOString() : null,
    hora: input.hora ? toStringId(input.hora) : null,
    total: toNumber(input.total ?? 0, 0),
    saldo: toNumber(input.saldo ?? input.pendiente ?? 0, 0),
    metodoPago,
    estado: (input.estado as boolean | null | undefined) ?? null,
    observaciones: (input.observaciones as string | null | undefined) ?? null,
    tipoMovimiento,
    items: detalles.map((item, idx) => normalizeDetalle(item, idx)),
  };
}

export function normalizeTipoMovimientoList(raw: unknown): TipoMovimiento[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => normalizeTipoMovimiento(row));
}
