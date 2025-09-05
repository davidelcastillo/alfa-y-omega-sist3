// src/app/productos/page.tsx
import { fetchCatalogos, fetchProductos } from '@/server/productos.queries'
import ProductsPageClient from './products-page-client'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"


export const revalidate = 0 // o: export const dynamic = 'force-dynamic'

function boolToEstado(b: boolean): 'Activo' | 'Inactivo' {
  return b ? 'Activo' : 'Inactivo'
}

export default async function Page() {
  const [{ rubros, unidades }, dbRows] = await Promise.all([
    fetchCatalogos(),
    fetchProductos(),
  ])

  const uiProducts = dbRows.map(p => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion ?? '',       // ahora viene real desde DB
    rubro: p.rubroNombre,
    marca: p.marcaNombre,
    unidad: p.unidadNombre,
    precioVenta: p.precioVenta,
    precioLista: p.precioCompra,      // mostramos compra como “lista”
    estado: boolToEstado(p.estado),   // <- union exacta
    rubroId: p.rubroId,
    unidadId: p.unidadId,
    estadoBool: p.estado,
  }))

  return (
    <ProductsPageClient
      initialProducts={uiProducts}
      rubros={rubros}
      unidades={unidades}
    />
  )
}
