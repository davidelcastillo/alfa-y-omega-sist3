// src/components/eco/Header.tsx
"use client"
import Link from "next/link"

export default function Header() {
    return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <nav className="section h-14 flex items-center justify-between">
            <Link href="/eco/inicio" className="font-bold text-lg">
                <span className="text-[var(--brand-600)]">ALFA</span>·OMEGA <span className="text-sm text-gray-500">Shop</span>
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/eco/inicio" className="hover:underline">Inicio</Link>
                <Link href="/eco/productos" className="hover:underline">Productos</Link>
                <Link href="/eco/carrito" className="hover:underline">Carrito</Link>
                <Link href="/eco/login" className="rounded-lg px-3 py-1.5 text-white gradient-brand">Ingresar</Link>
            </div>
        </nav>
    </header>
    )
}
