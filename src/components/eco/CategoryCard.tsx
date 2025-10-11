// src/components/eco/CategoryCard.tsx
import Link from "next/link"
import type { CategoryMock } from "@/mocks/eco/categories"

export default function CategoryCard({ c }: { c: CategoryMock }) {
  return (
    <Link
      href={`/eco/categoria/${c.slug}`}
      className="glass rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition"
    >
      <div>
        <h3 className="font-semibold">{c.name}</h3>
        <p className="text-xs text-gray-500">Ver productos</p>
      </div>
      <span className="text-2xl">{c.icon ?? "🛒"}</span>
    </Link>
  )
}
