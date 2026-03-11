// src/components/eco/productos/ProductsToolbar.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

type CatalogosResponse = {
  ok: boolean
  data?: {
    rubros: { id: number; nombre: string }[]
    marcas: { id: number; nombre: string }[]
    unidades: { id: number; nombre: string }[]   // 👈 Asegurate de devolver {id,nombre}
  }
  error?: string
}

export default function ProductsToolbar() {
  const router = useRouter()
  const sp = useSearchParams()

  const [q, setQ]                 = useState(sp.get("q") ?? "")
  const [brandId, setBrandId]     = useState<string>(sp.get("brandId") ?? "")
  const [categoryId, setCategoryId]= useState<string>(sp.get("categoryId") ?? "")
  const [unitId, setUnitId]       = useState<string>(sp.get("unitId") ?? "")

  const [rubros, setRubros]       = useState<{ id: number; nombre: string }[]>([])
  const [marcas, setMarcas]       = useState<{ id: number; nombre: string }[]>([])
  const [unidades, setUnidades]   = useState<{ id: number; nombre: string }[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function fetchCatalogos() {
      try {
        const res = await fetch(`/api/productos/catalogos`, { cache: "no-store" })
        const data: CatalogosResponse = await res.json()
        if (data.ok && data.data) {
          setRubros(data.data.rubros)
          setMarcas(data.data.marcas)
          setUnidades(data.data.unidades) // 👈 ahora es {id,nombre}
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
      // 👇 CAMBIO AQUÍ
    if (q) params.set("search", q) // Cambiado de "q" a "search"
    if (brandId) params.set("brandId", brandId)
    if (categoryId) params.set("categoryId", categoryId)
    if (unitId) params.set("unitId", unitId)
    router.push(`/eco/productos?${params.toString()}`)
  }

  function clearAll() {
    setQ(""); setBrandId(""); setCategoryId(""); setUnitId("")
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
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full border rounded-lg h-10 px-2"
            >
              <option value="">Todas</option>
              {marcas.map(m => (
                <option key={m.id} value={String(m.id)}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Rubro</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded-lg h-10 px-2"
            >
              <option value="">Todos</option>
              {rubros.map(r => (
                <option key={r.id} value={String(r.id)}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Unidad</label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full border rounded-lg h-10 px-2"
            >
              <option value="">Todas</option>
              {unidades.map(u => (
                <option key={u.id} value={String(u.id)}>{u.nombre}</option>
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
