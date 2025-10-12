// src/components/eco/productos/ProductCard.tsx
"use client"
import Link from "next/link"

type UiProduct = {
  id: number | string
  name: string
  brand?: string | null
  price?: number | null
  imageUrl?: string | null
  slug?: string | null
}

export default function ProductCard({ p }: { p: UiProduct }) {
  async function add() {
    // Hook futuro: POST /api/eco/cart
    // await fetch("/api/eco/cart", { method: "POST", body: JSON.stringify({ productId: p.id, qty: 1 }) })
  }

  const imgSrc = p.imageUrl || "/placeholder.png"
  const hasPrice = typeof p.price === "number" && !Number.isNaN(p.price)
  const priceText = hasPrice ? `$${Number(p.price).toLocaleString("es-AR")}` : "Consultar"
  const href = `/eco/producto/${p.slug ?? p.id}`

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="relative h-40">
        {/* si luego migrás a next/image, perfecto; por ahora <img/> está bien */}
        <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold line-clamp-2">{p.name}</h3>
        {p.brand ? <p className="text-xs text-gray-500">{p.brand}</p> : null}

        <div className="flex items-center justify-between pt-2">
          <span className="font-bold">{priceText}</span>

          <div className="flex gap-2">
            <button
              onClick={add}
              className="text-sm px-3 py-1.5 rounded-lg bg-[var(--brand-600)] text-white"
            >
              Comprar
            </button>
            {/*<Link href={href} className="text-sm px-3 py-1.5 rounded-lg border">
              Ver
            </Link>*/}
          </div>
        </div>
      </div>
    </div>
  )
}
