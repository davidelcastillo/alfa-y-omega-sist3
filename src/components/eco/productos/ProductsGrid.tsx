// src/components/eco/ProductsGrid.tsx
"use client"
import ProductCard from "./ProductCard"

export default function ProductsGrid({ products }: { products: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  )
}
