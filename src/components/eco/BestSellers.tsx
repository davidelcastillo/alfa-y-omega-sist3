// src/components/eco/BestSellers.tsx
"use client"

import TopBrandsCircles  from "./TopBrandsCircles" // este muestra las 5 marcas

export default function BestSellers() {
  return (
    <section id="mas-vendidos" className="section py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold">Marcas populares</h2>
        <a href="/eco/productos" className="text-sm text-[var(--brand-600)] hover:underline">
          Ver todo
        </a>
      </div>

      {/* Renderizamos UNA sola vez el showcase de 5 marcas */}
      <TopBrandsCircles  />
    </section>
  )
}
