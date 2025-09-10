export type Estado = 'Activo' | 'Inactivo'
export type TipoDeposito = 'Principal' | 'Sucursal' | 'Temporal' | 'Tránsito'

export interface Deposito {
  id: number
  nombre: string
  provincia: string
  ciudad: string
  ubicacion: string
  tipo: TipoDeposito
  capacidad?: number
  itemsStock: number
  estado: Estado
  descripcion?: string
}


export interface ProductoLite {
  id: number
  descripcion: string
  precioVenta: number
}

export interface StockItem {
  id: number
  depositId: number
  productId: number
  stockActual: number
  stockMinimo: number
  stockMaximo: number
}
