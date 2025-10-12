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
            Equipate con lo mejor que puede ofrecer un corralon. Calidad, precio y envío rápido.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/eco/productos" className="px-5 py-2.5 rounded-lg bg-white text-[var(--brand-600)] font-semibold">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
