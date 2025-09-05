import { Product } from '@/lib/types'


export const productsData: Product[] = [
{ id: 1, descripcion: 'Smartphone Samsung Galaxy A54', rubro: 'Electrónicos', marca: 'Samsung', unidad: 'Unidad', precioVenta: 299.99, precioLista: 349.99, estado: 'Activo' },
{ id: 2, descripcion: 'Cafetera Automática Deluxe', rubro: 'Hogar', marca: 'Philips', unidad: 'Unidad', precioVenta: 189.5, precioLista: 220.00, estado: 'Activo' },
{ id: 3, descripcion: 'Zapatillas Running Pro', rubro: 'Deportes', marca: 'Nike', unidad: 'Par', precioVenta: 129.99, precioLista: 159.99, estado: 'Activo' },
{ id: 4, descripcion: 'Camisa Casual Algodón', rubro: 'Ropa', marca: 'Zara', unidad: 'Unidad', precioVenta: 45.00, precioLista: 55.00, estado: 'Inactivo' },
{ id: 5, descripcion: 'Auriculares Bluetooth Premium', rubro: 'Electrónicos', marca: 'Sony', unidad: 'Unidad', precioVenta: 199.99, precioLista: 249.99, estado: 'Activo' },
]


export const rubros = ['Electrónicos', 'Hogar', 'Deportes', 'Ropa'] as const
export const estados = ['Activo', 'Inactivo'] as const