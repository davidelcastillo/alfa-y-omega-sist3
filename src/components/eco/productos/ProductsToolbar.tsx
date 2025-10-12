"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { slugify  } from "@/lib/eco/slug"

type CatalogosResponse = {
  ok: boolean
  data?: {
    rubros: { id: number; nombre: string }[]
    marcas: { id: number; nombre: string }[]
    unidades: { id: number; nombre: string }[]
  }
  error?: string
}

export default function ProductsToolbar() {
  const router = useRouter()
  const sp = useSearchParams()

  const [q, setQ] = useState(sp.get("q") ?? "")
  const [brand, setBrand] = useState(sp.get("brand") ?? "")
  const [category, setCategory] = useState(sp.get("category") ?? "")
  const [unit, setUnit] = useState(sp.get("unit") ?? "")

  // Catálogos
  const [rubros, setRubros] = useState<{ id: number; nombre: string }[]>([])
  const [marcas, setMarcas] = useState<{ id: number; nombre: string }[]>([])
  const [unidades, setUnidades] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCatalogos() {
      try {
        const res = await fetch(`/api/productos/catalogos`, { cache: "no-store" })
        const data: CatalogosResponse = await res.json()
        if (data.ok && data.data) {
          setRubros(data.data.rubros)
          setMarcas(data.data.marcas)
          setUnidades(data.data.unidades.map(u => u.nombre))
        }
      } catch (err) {
        console.error("Error cargando catálogos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCatalogos()
  }, [])

  function apply() {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (brand) params.set("brand", brand)
    if (category) params.set("category", category)
    if (unit) params.set("unit", unit)
    router.push(`/eco/productos?${params.toString()}`)
  }

  function clearAll() {
    setQ(""); setBrand(""); setCategory(""); setUnit("")
    router.push(`/eco/productos`)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") apply()
  }

  return (
    <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-end">
      <div className="flex-1">
        <label className="block text-sm text-gray-600 mb-1">Buscar</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nombre o descripción…"
          className="w-full border rounded-lg px-3 h-10"
        />
      </div>

      {loading ? (
        <div className="text-gray-500 italic p-3">Cargando filtros...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Marca</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border rounded-lg h-10 px-2"
            >
              <option value="">Todas</option>
              {marcas.map(m => (
                <option key={m.id} value={m.nombre.toLowerCase()}>{m.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rubro</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg h-10 px-2"
            >
              <option value="">Todos</option>
              {rubros.map(r => (
                <option key={r.id} value={r.nombre.toLowerCase()}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Unidad</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full border rounded-lg h-10 px-2"
            >
              <option value="">Todas</option>
              {unidades.map(u => (
                <option key={u} value={u.toLowerCase()}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={apply} className="px-4 h-10 rounded-lg bg-[var(--brand-600)] text-white">Aplicar</button>
        <button onClick={clearAll} className="px-4 h-10 rounded-lg border">Limpiar</button>
      </div>
    </div>
  )
}
