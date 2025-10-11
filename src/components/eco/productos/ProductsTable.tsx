// src/components/eco/ProductsTable.tsx
"use client"
import { useMemo, useState } from "react"
import type { ProductMock } from "@/mocks/eco/products"

type Props = { products: ProductMock[] }

type SortKey = "name" | "brand" | "category" | "unit" | "price"
type SortDir = "asc" | "desc"

export default function ProductsTable({ products }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  function toggleSort(k: SortKey) {
    if (k === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortKey(k); setSortDir("asc") }
  }

  const rows = useMemo(() => {
    const copy = [...products]
    copy.sort((a, b) => {
      const get = (k: SortKey) => {
        if (k === "name") return a.name.localeCompare(b.name)
        if (k === "brand") return (a.brand || "").localeCompare(b.brand || "")
        if (k === "category") return (a.categorySlug || "").localeCompare(b.categorySlug || "")
        if (k === "unit") return (a.unit || "").localeCompare(b.unit || "")
        if (k === "price") return a.price - b.price
        return 0
      }
      const sign = sortDir === "asc" ? 1 : -1
      return get(sortKey) * sign
    })
    return copy
  }, [products, sortKey, sortDir])

  const th = (label: string, k: SortKey) => (
    <th className="px-3 py-2 text-left text-sm font-semibold cursor-pointer select-none" onClick={() => toggleSort(k)}>
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
      </span>
    </th>
  )

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {th("Producto", "name")}
            {th("Marca", "brand")}
            {th("Rubro", "category")}
            {th("Unidad", "unit")}
            {th("Precio", "price")}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl || "/placeholder.png"} alt={p.name} className="h-10 w-10 rounded object-cover" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    {p.description && <div className="text-xs text-gray-500 line-clamp-1">{p.description}</div>}
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-sm">{p.brand || "-"}</td>
              <td className="px-3 py-2 text-sm">{p.categorySlug || "-"}</td>
              <td className="px-3 py-2 text-sm">{p.unit || "-"}</td>
              <td className="px-3 py-2 font-semibold">${p.price.toLocaleString("es-AR")}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>
                No hay productos que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
