// src/app/eco/productos/page.tsx
import ProductosClient from "./ProductosClient"
import { PRODUCTS_ALL } from "@/mocks/eco/products"

type Props = { searchParams: { q?: string; brand?: string; category?: string; unit?: string } }

export default async function ProductosPage({ searchParams }: Props) {
  const { q = "", brand = "", category = "", unit = "" } = searchParams

  // Filtro in-memory con mocks (luego se reemplaza por fetch a /api/eco/products)
  const qn = q.trim().toLowerCase()
  const filtered = PRODUCTS_ALL.filter(p => {
    const matchesQ = !qn || (p.name.toLowerCase().includes(qn) || (p.description ?? "").toLowerCase().includes(qn))
    const matchesBrand = !brand || p.brandSlug === brand
    const matchesCat = !category || p.categorySlug === category
    const matchesUnit = !unit || p.unit === unit
    return matchesQ && matchesBrand && matchesCat && matchesUnit
  })

  return <ProductosClient products={filtered} />
}
