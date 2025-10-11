// src/components/eco/Categories.tsx
import { CATEGORIES } from "@/mocks/eco/categories"
import CategoryCard from "./CategoryCard"

export default function Categories() {
  return (
    <section id="categorias" className="section py-12">
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map((c) => <CategoryCard key={c.id} c={c} />)}
      </div>
    </section>
  )
}
