"use client"
import ProductCard from "./ProductCard"
import type { UiProduct } from "./ProductCard"

export default function ProductsGrid({ products }: { products: UiProduct[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}
