// src/app/eco/productos/ProductosClient.tsx
"use client"
import ProductsToolbar from "@/components/eco/productos/ProductsToolbar"
import ProductsGrid from "@/components/eco/productos/ProductsGrid"
import EmptyState from "@/components/eco/productos/EmptyState"

export default function ProductosClient({ products }: { products: any[] }) {
  return (
    <div className="section py-8 space-y-6">
      <h1 className="text-2xl font-bold">Todos los productos</h1>
      <ProductsToolbar />
      {products.length ? <ProductsGrid products={products} /> : <EmptyState />}
    </div>
  )
}
