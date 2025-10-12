"use client"
import ProductCard from "./ProductCard"
import type { UiProduct } from "@/app/eco/productos/ProductosClient"

export default function ProductsGrid({ products }: { products: UiProduct[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  )
}
