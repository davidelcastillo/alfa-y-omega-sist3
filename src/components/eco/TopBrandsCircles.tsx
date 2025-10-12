// src/components/eco/productos/ProductCard.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { slugify } from "@/lib/eco/slug"

type Marca = { id: number; nombre: string }
type CatalogosResponse = {
  ok: boolean
  data?: { rubros: any[]; marcas: Marca[]; unidades: any[] }
  error?: string
}

// IDs a mostrar (exclusivos y en este orden)
const TARGET_IDS = [1, 25, 34, 4, 28] as const

// (Opcional) si querés forzar un nombre/archivo distinto al patrón por id,
// definilo acá. Si no está, se usa /brands/{id}.png
const BRAND_IMAGES: Partial<Record<number, string>> = {
  // 25: "/brands/mi-otro-logo.svg",
}

export default function ProductCard() {
  const router = useRouter()
  const [top, setTop] = useState<Marca[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let stop = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/productos/catalogos", { cache: "no-store" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: CatalogosResponse = await res.json()
        if (!json.ok || !json.data) throw new Error(json.error || "Respuesta inválida")

        const marcas = json.data.marcas ?? []
        const dict = new Map(marcas.map(m => [m.id, m]))

        // Seleccionar SOLO los TARGET_IDS (y mantener el orden del array)
        const seleccion = TARGET_IDS.map(id => dict.get(id)).filter(Boolean) as Marca[]

        if (!stop) setTop(seleccion)
      } catch (e: any) {
        if (!stop) setErr(e?.message || "Error al cargar marcas")
      } finally {
        if (!stop) setLoading(false)
      }
    })()
    return () => { stop = true }
  }, [])

  function go(m: Marca) {
    const brandSlug = slugify(m.nombre)
    router.push(`/eco/productos?brand=${encodeURIComponent(brandSlug)}`)
  }

  return (
    <section className="w-full rounded-2xl bg-white/80 backdrop-blur border border-black/5 p-6">
      <h3 className="text-xl font-semibold mb-6">No te lo pierdas</h3>

      {loading && <p className="text-sm text-gray-500">Cargando marcas…</p>}
      {err && <p className="text-sm text-red-600">Ocurrió un error: {err}</p>}

      {!loading && !err && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 place-items-center">
          {top.map((m) => {
            const logo = BRAND_IMAGES[m.id] ?? `/brands/${m.id}.png`
            const initials = m.nombre
              .split(/\s+/)
              .map(s => s[0])
              .join("")
              .slice(0, 3)
              .toUpperCase()

            return (
              <button
                key={m.id}
                onClick={() => go(m)}
                className="group w-full max-w-[160px] text-center focus:outline-none"
                aria-label={`Ver productos de ${m.nombre}`}
              >
                <div className="relative mx-auto h-28 w-28 rounded-full border border-black/10 bg-gradient-to-br from-gray-50 to-gray-200 shadow-sm overflow-hidden grid place-items-center transition-transform group-hover:scale-105">
                  {/* Si no existe el archivo en /public, se oculta <img> y quedan las iniciales */}
                  <img
                    src={logo}
                    alt={m.nombre}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                  />
                  <span className="absolute text-lg font-bold tracking-wide opacity-70 select-none">
                    {initials}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium leading-5">{m.nombre}</p>
                  <p className="text-xs text-gray-500 mt-1">Ver productos</p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
