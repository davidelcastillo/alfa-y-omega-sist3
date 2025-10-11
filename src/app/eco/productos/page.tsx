// src/app/eco/productos/page.tsx
import ProductosClient from "./ProductosClient"
import { headers } from "next/headers"

type Props = { searchParams: { q?: string; brand?: string; category?: string; unit?: string } }

type ApiProducto = {
  id: number
  nombre: string
  rubro: string | null
  marca: string | null
  unidad: string | null
}

const slug = (s: string | null | undefined) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

const slugifyName = (s: string) =>
  s.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

function toUiProduct(r: ApiProducto) {
  const name = r.nombre
  const brand = r.marca ?? undefined
  const category = r.rubro ?? undefined
  const unit = r.unidad ?? undefined

  return {
    id: r.id,
    name,
    brand,                       // string | undefined
    category,                    // string | undefined
    unit,                        // string | undefined
    description: [category, brand].filter(Boolean).join(" • "),
    brandSlug: slug(brand),
    categorySlug: slug(category),
    slug: `${r.id}-${slugifyName(name)}`,
    imageUrl: undefined,         // por ahora no hay imagen
    price: undefined,            // por ahora sin precio -> “Consultar”
  }
}

export const dynamic = "force-dynamic"

export default async function ProductosPage({ searchParams }: Props) {
  const { q = "", brand = "", category = "", unit = "" } = searchParams

  // Base absoluta (dev/prod)
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host  = h.get("x-forwarded-host") ?? h.get("host")
  const base  = `${proto}://${host}`

  // Fetch real a tu API
  const url = new URL("/api/catalogos/productos", base)
  if (q.trim()) url.searchParams.set("search", q.trim())
  url.searchParams.set("limit", "100")

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) return <ProductosClient products={[]} />

  const rows: ApiProducto[] = await res.json()
  const all = rows.map(toUiProduct)

  // Filtros in-memory
  const qn = q.trim().toLowerCase()
  const filtered = all.filter(p => {
    const matchesQ =
      !qn ||
      p.name.toLowerCase().includes(qn) ||
      (p.description ?? "").toLowerCase().includes(qn)

    const matchesBrand = !brand || p.brandSlug === brand
    const matchesCat   = !category || p.categorySlug === category
    const matchesUnit  = !unit || (p.unit ?? "") === unit

    return matchesQ && matchesBrand && matchesCat && matchesUnit
  })

  return <ProductosClient products={filtered} />
}
