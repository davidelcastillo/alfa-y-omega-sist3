export type Estado = 'Activo' | 'Inactivo'


export type Product = {
id: number
descripcion: string
rubro: 'Electrónicos' | 'Hogar' | 'Deportes' | 'Ropa' | string
marca: string
unidad: 'Unidad' | 'Kg' | 'Lt' | 'Mt' | 'Caja' | 'Par' | string
precioVenta: number
precioLista: number
estado: Estado
}