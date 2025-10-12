// src/app/eco/pages/page.tsx
import Hero from "@/components/eco/Hero"
import BestSellers from "@/components/eco/BestSellers"
import Categories from "@/components/eco/Categories"

export default function EcoHomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-gray-50">
      <Hero />
      <BestSellers />
      <Categories />
    </main>
  )
}
