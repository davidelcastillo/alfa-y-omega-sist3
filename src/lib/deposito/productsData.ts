//esto es para los mocks, despues borrarlo
import type { Deposito, ProductoLite, StockItem } from './types'

export const depositsMock: Deposito[] = [
  {
    id: 1,
    nombre: 'Depósito Central',
    provincia: 'Salta',
    ciudad: 'Rosario de Lerma',
    ubicacion: 'Avenida siempreviva 742, ciudad',
    tipo: 'Principal',
    capacidad: 1500,
    itemsStock: 450,
    estado: 'Activo',
    descripcion: 'Depósito principal para almacenamiento general',
  },
  {
    id: 2,
    nombre: 'Sucursal Norte',
    provincia: 'Córdoba',
    ciudad: 'Córdoba Capital',
    ubicacion: 'Calle Norte 456, Zona Norte',
    tipo: 'Sucursal',
    capacidad: 800,
    itemsStock: 320,
    estado: 'Activo',
    descripcion: 'Depósito de la sucursal norte',
  },
  {
    id: 3,
    nombre: 'Almacén Temporal',
    provincia: 'Santa Fe',
    ciudad: 'Rosario',
    ubicacion: 'Zona Industrial, Lote 789',
    tipo: 'Temporal',
    capacidad: 500,
    itemsStock: 180,
    estado: 'Activo',
    descripcion: 'Almacén temporal para productos estacionales',
  },
  {
    id: 4,
    nombre: 'Centro de Tránsito',
    provincia: 'Mendoza',
    ciudad: 'Mendoza Capital',
    ubicacion: 'Puerto Comercial, Sector B',
    tipo: 'Tránsito',
    capacidad: 300,
    itemsStock: 297,
    estado: 'Inactivo',
    descripcion: 'Centro de distribución y tránsito',
  },
]

export const productsLiteMock: ProductoLite[] = [
  { id: 1, descripcion: 'Smartphone Samsung Galaxy A54', precioVenta: 299.99 },
  { id: 2, descripcion: 'Cafetera Automática Deluxe', precioVenta: 189.5 },
  { id: 3, descripcion: 'Zapatillas Running Pro', precioVenta: 129.99 },
  { id: 4, descripcion: 'Camisa Casual Algodón', precioVenta: 45.0 },
  { id: 5, descripcion: 'Auriculares Bluetooth Premium', precioVenta: 199.99 },
]

export const stockItemsMock: StockItem[] = [
  { id: 1, depositId: 1, productId: 1, stockActual: 25, stockMinimo: 10, stockMaximo: 100 },
  { id: 2, depositId: 1, productId: 2, stockActual: 15, stockMinimo: 5,  stockMaximo: 50 },
  { id: 3, depositId: 2, productId: 1, stockActual: 12, stockMinimo: 8,  stockMaximo: 80 },
  { id: 4, depositId: 2, productId: 3, stockActual: 30, stockMinimo: 15, stockMaximo: 60 },
  { id: 5, depositId: 3, productId: 4, stockActual: 8,  stockMinimo: 20, stockMaximo: 100 },
  { id: 6, depositId: 3, productId: 5, stockActual: 85, stockMinimo: 10, stockMaximo: 50 },
]
