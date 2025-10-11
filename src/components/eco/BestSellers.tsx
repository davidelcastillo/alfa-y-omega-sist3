// src/components/eco/BestSellers.tsx
"use client"
import ProductCard from "./ProductCard"
import { BEST_SELLERS } from "@/mocks/eco/products"

export default function BestSellers() {
  return (
    <section id="mas-vendidos" className="section py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold">Más vendidos</h2>
        <a href="#" className="text-sm text-[var(--brand-600)] hover:underline">Ver todo</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {BEST_SELLERS.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}
