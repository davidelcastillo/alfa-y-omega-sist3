// src/components/eco/EmptyState.tsx
import Link from "next/link"

export default function EmptyState() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold">No encontramos resultados</h2>
      <p className="text-gray-500 mt-2">Probá limpiar los filtros o buscar otro término.</p>
      <Link href="/eco/productos" className="inline-block mt-6 px-4 py-2 rounded-lg border">
        Limpiar filtros
      </Link>
    </div>
  )
}
