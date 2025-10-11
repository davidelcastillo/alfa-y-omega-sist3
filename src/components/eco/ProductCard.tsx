// src/components/eco/ProductCard.tsx
"use client"
import Link from "next/link"
import type { ProductMock } from "@/mocks/eco/products"

export default function ProductCard({ p }: { p: ProductMock }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="relative h-40">
        <img
          src={p.imageUrl || "/placeholder.png"}
          alt={p.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-semibold line-clamp-2">{p.name}</h3>
        {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold">${p.price.toLocaleString("es-AR")}</span>
          <Link
            href={`/eco/producto/${p.slug}`}
            className="text-sm px-3 py-1.5 rounded-lg bg-[var(--brand-600)] text-white"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  )
}
