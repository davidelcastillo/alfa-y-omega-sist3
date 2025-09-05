export type UIProduct = {
  id: number
  nombre: string            
  descripcion?: string
  rubro: string
  marca: string
  unidad: string
  precioVenta: number
  precioLista: number        // mapeamos precioCompra -> precioLista para la tabla
  estado: 'Activo' | 'Inactivo'
    // IDs para filtrar client-side sin otra llamada
  rubroId: number
  unidadId: number
  estadoBool: boolean
}
