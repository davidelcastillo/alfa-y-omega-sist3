// src/components/eco/productos/ProductCard.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { cldThumb } from "@/lib/eco/cloudinary"
import { addToCart } from "@/lib/eco/cart";


export type UiProduct = {
  id: number | string
  name: string
  brand?: string | null
  price?: number | null
  imageUrl?: string | null
  slug?: string | null
}

export default function ProductCard({ p }: { p: UiProduct }) {
  async function add() {
  // 1) Guardar SIEMPRE en localStorage (UX inmediata)
    addToCart({
      id: p.id,
      name: p.name,
      image: p.imageUrl || "/placeholder.png",  // Carrito espera "image"
      price: p.price ?? 0,
      description: p.brand ?? null, // opcional
    });

    try {
      window.dispatchEvent(new Event("eco:cart-changed"));
    } catch {}

    // 2) Intentar sincronizar con backend si hay sesión (no bloquea la UI)
    try {
      const resp = await fetch("/api/eco/carrito/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productoId: Number(p.id), cantidad: 1 }),
      });
      // Si 401 → el user no está logueado: quedamos con LS y listo
      if (!resp.ok && resp.status !== 401) {
        console.warn("No se pudo sincronizar carrito en DB.");
      }
    } catch (e) {
      console.warn("Fallo de red al sincronizar carrito. Queda en LS.", e);
    }
  }

  const raw = p.imageUrl || "/placeholder.png"
  const imgSrc = p.imageUrl ? cldThumb(raw) : raw

  const hasPrice = typeof p.price === "number" && !Number.isNaN(p.price)
  const priceText = hasPrice ? `$${Number(p.price).toLocaleString("es-AR")}` : "Consultar"
  const href = `/eco/producto/${p.slug ?? p.id}`

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Contenedor de imagen con proporción fija */}
      <div className="relative aspect-[4/3]">
        <Image
          src={imgSrc}
          alt={p.name}
          fill
          className="object-cover"
          // Móvil: pantalla completa, luego 33% en md, 25% en xl
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />
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
            {/* <Link href={href} className="text-sm px-3 py-1.5 rounded-lg border">Ver</Link> */}
          </div>
        </div>
      </div>
    </div>
  )
}
