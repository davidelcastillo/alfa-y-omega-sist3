// Mocks de "Pagos a proveedores"
// TODO: conectar API — reemplazar estos mocks por fetch/servicios reales

export type PaymentStatus = 'Pendiente de pago' | 'Pagado' | 'Vencido';
export type PaymentMethod = 'Transferencia' | 'Cheque' | 'Efectivo' | 'Tarjeta';
export type VoucherType = 'FAC' | 'NC' | 'ND';

export interface SupplierLite {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
}

export interface PaymentProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PartialPayment {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  user: string;
  paymentMethod: PaymentMethod;
}

export interface HistoryEvent {
  date: string; // 'YYYY-MM-DD HH:mm'
  action: string;
  user: string;
}

export interface SupplierPayment {
  id: string;
  paymentId: string;
  registrationDate: string; // 'YYYY-MM-DD HH:mm:ss'
  invoiceCode: string;
  purchaseOrderNumber: string;
  paymentDueDate: string; // YYYY-MM-DD
  dueDate: string;        // YYYY-MM-DD
  supplier: SupplierLite;
  total: number;
  payment: number;
  balance: number;
  comment?: string;
  status: PaymentStatus;
  paymentCompleteDate?: string; // YYYY-MM-DD
  paymentMethod?: PaymentMethod;
  voucherType?: VoucherType;
  voucherNumber?: string;
  products: PaymentProduct[];
  history: HistoryEvent[];
  partialPayments?: PartialPayment[];
}

export const suppliersMock: SupplierLite[] = [
  { id: 'PROV001', name: 'Distribuidora Central S.A.', code: 'DC001', email: 'pagos@distribuidora.com', phone: '+54 11 4567-8900' },
  { id: 'PROV002', name: 'Suministros Industriales Ltda.', code: 'SI002', email: 'cobranzas@suministros.com', phone: '+54 11 4567-8901' },
  { id: 'PROV003', name: 'Tecnología Avanzada S.R.L.', code: 'TA003', email: 'administracion@tecavanzada.com', phone: '+54 11 4567-8902' },
];

export const supplierPaymentsMock: SupplierPayment[] = [
  {
    id: '1',
    paymentId: 'PAG-001',
    registrationDate: '2024-01-10 14:30:00',
    invoiceCode: 'FC-2024-001',
    purchaseOrderNumber: 'OC-001',
    paymentDueDate: '2024-01-15',
    dueDate: '2024-01-15',
    supplier: suppliersMock[0],
    total: 125000,
    payment: 0,
    balance: 125000,
    comment: 'Pago pendiente - primera factura del mes',
    status: 'Pendiente de pago',
    voucherType: 'FAC',
    voucherNumber: '00001-00000001',
    paymentMethod: 'Transferencia',
    products: [
      { id: '1', name: 'Producto A', quantity: 10, unitPrice: 5000, subtotal: 50000 },
      { id: '2', name: 'Producto B', quantity: 15, unitPrice: 5000, subtotal: 75000 },
    ],
    history: [{ date: '2024-01-10 14:30', action: 'Pago registrado (parcial: 0)', user: 'Sistema' }],
    partialPayments: [],
  },
  {
    id: '2',
    paymentId: 'PAG-002',
    registrationDate: '2024-01-12 09:15:00',
    invoiceCode: 'FC-2024-002',
    purchaseOrderNumber: 'OC-002',
    paymentDueDate: '2024-01-20',
    dueDate: '2024-01-20',
    supplier: suppliersMock[1],
    total: 89500,
    payment: 89500,
    balance: 0,
    comment: 'Pago completado via transferencia',
    status: 'Pagado',
    paymentCompleteDate: '2024-01-18',
    paymentMethod: 'Transferencia',
    voucherType: 'FAC',
    voucherNumber: '00001-00000002',
    products: [{ id: '3', name: 'Producto C', quantity: 20, unitPrice: 4475, subtotal: 89500 }],
    history: [
      { date: '2024-01-12 09:15', action: 'Pago realizado', user: 'Carlos López' },
      { date: '2024-01-18 16:45', action: 'Pago realizado', user: 'Carlos López' },
    ],
    partialPayments: [
      { id: '1', amount: 89500, date: '2024-01-18', time: '16:45', user: 'Carlos López', paymentMethod: 'Transferencia' },
    ],
  },
  {
    id: '3',
    paymentId: 'PAG-003',
    registrationDate: '2023-12-28 11:20:00',
    invoiceCode: 'FC-2024-003',
    purchaseOrderNumber: 'OC-003',
    paymentDueDate: '2024-01-05',
    dueDate: '2024-01-05',
    supplier: suppliersMock[2],
    total: 245000,
    payment: 0,
    balance: 245000,
    comment: 'Pago vencido - requiere atención urgente',
    status: 'Vencido',
    voucherType: 'FAC',
    voucherNumber: '00001-00000003',
    paymentMethod: 'Cheque',
    products: [{ id: '4', name: 'Producto D', quantity: 49, unitPrice: 5000, subtotal: 245000 }],
    history: [
      { date: '2023-12-28 11:20', action: 'Pago registrado (parcial: 0)', user: 'Sistema' },
      { date: '2024-01-06 00:00', action: 'Pago vencido', user: 'Sistema' },
    ],
    partialPayments: [],
  },
];

// mocks/pagos.mock.ts
export const voucherTypeOptionsMock = [
  { id: 1, nombre: 'Factura A' },
  { id: 2, nombre: 'Factura B' },
  { id: 3, nombre: 'Factura C' },
  { id: 4, nombre: 'Nota de Crédito' },
  { id: 5, nombre: 'Nota de Débito' },
];

export const voucherNumberOptionsMock = [
  // nombre visible → "00001-00000001 · Proveedor X"
  { id: 1, nombre: '00001-00000001 · Distribuidora Central S.A.' },
  { id: 2, nombre: '00001-00000002 · Suministros Industriales Ltda.' },
  { id: 3, nombre: '00001-00000003 · Tecnología Avanzada S.R.L.' },
];

export const paymentMethodOptionsMock = [
  { id: 1, nombre: 'Transferencia' },
  { id: 2, nombre: 'Efectivo' },
  { id: 3, nombre: 'Cheque' },
  { id: 4, nombre: 'Tarjeta' },
];
