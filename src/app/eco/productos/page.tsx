// src/app/eco/productos/page.tsx
import ProductosClient from "./ProductosClient"
import { headers } from "next/headers"

// Tipos, slug, y toUiProduct se mantienen exactamente igual que antes.
type Props = { 
    searchParams: { 
        search?: string; 
        brandId?: string; 
        categoryId?: string; 
        unitId?: string 
    } 
}

type ApiProducto = {
  id: number
  nombre: string
  rubro: string | null
  marca: string | null
  unidad: string | null
  imageUrl?: string | null
  precioVenta?: number | null
}

const slug = (s: string | null | undefined) => (s ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
const slugifyName = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

function toUiProduct(r: ApiProducto) {
  const name = r.nombre
  const brand = r.marca ?? undefined
  const category = r.rubro ?? undefined
  const unit = r.unidad ?? undefined

  return {
    id: r.id,
    name,
    brand,
    category,
    unit,
    description: [category, brand].filter(Boolean).join(" • "),
    brandSlug: slug(brand),
    categorySlug: slug(category),
    slug: `${r.id}-${slugifyName(name)}`,
    imageUrl: r.imageUrl ?? undefined,
    price: r.precioVenta ?? undefined,
  }
}

export const dynamic = "force-dynamic"

export default async function ProductosPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  // 1. Ahora accedemos a los parámetros de esta forma.
  const search = searchParams.search as string || '';
  const brandId = searchParams.brandId as string || '';
  const categoryId = searchParams.categoryId as string || '';
  const unitId = searchParams.unitId as string || '';

  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const base = `${proto}://${host}`

  const DEPOSITO_ID = 1;
  const url = new URL(`/api/depositos/${DEPOSITO_ID}/productos`, base)
  
  if (search) url.searchParams.set("search", search);
  if (brandId) url.searchParams.set("brandId", brandId);
  if (categoryId) url.searchParams.set("categoryId", categoryId);
  if (unitId) url.searchParams.set("unitId", unitId);
  url.searchParams.set("limit", "100");
  url.searchParams.set("inStockOnly", "1");
  
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    console.error("Error fetching products:", await res.text());
    return <ProductosClient products={[]} />
  }

  const rows: ApiProducto[] = await res.json()
  const products = rows.map(toUiProduct)

  return <ProductosClient products={products} />
}