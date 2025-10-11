// src/components/eco/ProductsToolbar.tsx
"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { BRANDS } from "@/mocks/eco/brands"
import { RUBROS } from "@/mocks/eco/rubros"

const UNITS = ["unidad","par","kit","caja"] as const

export default function ProductsToolbar() {
  const router = useRouter()
  const sp = useSearchParams()

  const [q, setQ] = useState(sp.get("q") ?? "")
  const [brand, setBrand] = useState(sp.get("brand") ?? "")
  const [category, setCategory] = useState(sp.get("category") ?? "")
  const [unit, setUnit] = useState(sp.get("unit") ?? "")

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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Marca</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full border rounded-lg h-10 px-2">
            <option value="">Todas</option>
            {BRANDS.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Rubro</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg h-10 px-2">
            <option value="">Todos</option>
            {RUBROS.map(r => <option key={r.slug} value={r.slug}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Unidad</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border rounded-lg h-10 px-2">
            <option value="">Todas</option>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={apply} className="px-4 h-10 rounded-lg bg-[var(--brand-600)] text-white">Aplicar</button>
        <button onClick={clearAll} className="px-4 h-10 rounded-lg border">Limpiar</button>
      </div>
    </div>
  )
}
