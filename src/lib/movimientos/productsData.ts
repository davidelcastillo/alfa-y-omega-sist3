// src/lib/productsData.ts
export type MovimientoBasico = 'Ingreso' | 'Egreso';
export type TipoMovimiento =
  | 'Transferencia entre depósitos'
  | 'Compra de inventario'
  | 'Venta de inventario'
  | 'Ajuste de stock';

export type Deposito = { id: number; nombre: string; ubicacion?: string };
export type ProductoLite = { id: number; codigo: string; descripcion: string };

export type Movimiento = {
  id: number;
  fechaISO: string; // YYYY-MM-DD
  deposito?: Deposito; // para ingreso/ajuste/venta/compra
  depositoOrigen?: Deposito; // para transferencias
  depositoDestino?: Deposito; // para transferencias
  movimiento: MovimientoBasico;
  tipoMovimiento: TipoMovimiento;
  comprobanteId?: string;
  comentario?: string;
  productos: Array<{ producto: ProductoLite; cantidad: number }>;
};

export const depositosMock: Deposito[] = [
  { id: 1, nombre: 'Depósito Central', ubicacion: 'Parque Industrial' },
  { id: 2, nombre: 'Depósito Norte', ubicacion: 'B° Norte' },
  { id: 3, nombre: 'Depósito Sur', ubicacion: 'B° Sur' },
  { id: 4, nombre: 'Mock', ubicacion: 'B° Sur' },

];

export const productosLiteMock: ProductoLite[] = [
  { id: 101, codigo: 'P-000101', descripcion: 'Cemento x50kg' },
  { id: 102, codigo: 'P-000102', descripcion: 'Hierro Ø8mm' },
  { id: 103, codigo: 'P-000103', descripcion: 'Arena fina m3' },
];

export const movimientosMock: Movimiento[] = [
  {
    id: 1,
    fechaISO: '2025-09-10',
    deposito: depositosMock[0],
    movimiento: 'Ingreso',
    tipoMovimiento: 'Compra de inventario',
    comprobanteId: 'F-000123',
    comentario: 'Proveedor ACME',
    productos: [
      { producto: productosLiteMock[0], cantidad: 30 },
      { producto: productosLiteMock[2], cantidad: 5 },
    ],
  },
  {
    id: 2,
    fechaISO: '2025-09-11',
    depositoOrigen: depositosMock[0],
    depositoDestino: depositosMock[2],
    movimiento: 'Egreso',
    tipoMovimiento: 'Transferencia entre depósitos',
    comprobanteId: 'TR-000045',
    comentario: 'Urgente para obra',
    productos: [{ producto: productosLiteMock[1], cantidad: 50 }],
  },
  {
    id: 3,
    fechaISO: '2025-09-12',
    deposito: depositosMock[1],
    movimiento: 'Egreso',
    tipoMovimiento: 'Venta de inventario',
    comprobanteId: 'V-000778',
    productos: [{ producto: productosLiteMock[0], cantidad: 10 }],
  },
];

export function getStats(movs: Movimiento[]) {
  const total = movs.length;
  const ingresos = movs.filter(m => m.movimiento === 'Ingreso').length;
  const egresos = movs.filter(m => m.movimiento === 'Egreso').length;
  return { total, ingresos, egresos };
}
