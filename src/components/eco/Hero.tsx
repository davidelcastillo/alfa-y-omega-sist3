// src/components/eco/Hero.tsx
import Link from "next/link"

export default function Hero() {
  return (
    <section className="gradient-brand">
      <div className="section py-16 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Bienvenidos a la Tienda <span className="opacity-90">Alfa y Omega</span>
          </h1>
          <p className="mt-4 md:text-lg text-white/90">
            Equipate con lo mejor en tecnología y accesorios. Calidad, precio y envío rápido.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="#mas-vendidos" className="px-5 py-2.5 rounded-lg bg-white text-[var(--brand-600)] font-semibold">
              Ver más vendidos
            </Link>
            <Link href="#categorias" className="px-5 py-2.5 rounded-lg bg-white/10 border border-white/40 hover:bg-white/15">
              Explorar categorías
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
