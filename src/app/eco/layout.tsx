// src/app/eco/layout.tsx
import type { ReactNode } from "react"
import Header from "@/components/eco/Header"
import Footer from "@/components/eco/Footer"

// (Opcional) título base de la sección e-commerce
export const metadata = { title: "Tienda · ERP" }

export default function EcoLayout({ children }: { children: ReactNode }) {
  return (
    // Importante: NO <html>/<body> aquí (ya están en app/layout.tsx)
    <div className="min-h-dvh flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main id="eco-main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
