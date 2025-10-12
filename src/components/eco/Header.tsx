// src/components/eco/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type AuthUser = {
    id: number;
    email: string;
    role: string;
    name?: string;
};

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchMe = useCallback(async () => {
        try {
            const res = await fetch("/api/eco/yo", { method: "POST" });
            if (!res.ok) { setUser(null); return; }
            const data = await res.json();
            setUser({
                id: Number(data.id),
                email: data.email,
                role: data.role ?? "",
                name: `${data.nombre ?? ""} ${data.apellido ?? ""}`.trim() || undefined,
            });
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMe(); }, [fetchMe]);

    // escucha cambios (login/logout) sin F5
    useEffect(() => {
        const onAuthChanged = () => fetchMe();
        window.addEventListener("eco:auth-changed", onAuthChanged);
        return () => window.removeEventListener("eco:auth-changed", onAuthChanged);
    }, [fetchMe]);

    async function doLogout() {
        try { await fetch("/api/eco/logout", { method: "POST" }); } catch { }
        setUser(null);
        setConfirmOpen(false);
        router.push("/eco/inicio");
        router.refresh();
        window.dispatchEvent(new Event("eco:auth-changed"));
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
                <nav className="section h-14 flex items-center justify-between">
                    <Link href="/eco/inicio" className="font-bold text-lg">
                        <span className="text-[var(--brand-600)]">ALFA</span>·OMEGA{" "}
                        <span className="text-sm text-gray-500">Shop</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/eco/inicio" className="hover:underline">Inicio</Link>
                        <Link href="/eco/productos" className="hover:underline">Productos</Link>
                        <Link href="/eco/carrito" className="hover:underline">Carrito</Link>

                        {loading ? (
                            <span className="text-gray-500 text-sm">Cargando…</span>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700">
                                    Hola, <strong>{user.name || user.email}</strong>
                                </span>
                                <button
                                    onClick={() => setConfirmOpen(true)}
                                    className="rounded-lg px-3 py-1.5 text-white bg-gray-700 hover:bg-gray-800"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <Link href="/eco/login" className="rounded-lg px-3 py-1.5 text-white gradient-brand">
                                Ingresar
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            {confirmOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-labelledby="logout-title">
                    <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-6">
                        <h2 id="logout-title" className="text-lg font-semibold mb-2">¿Seguro que querés cerrar sesión?</h2>
                        <p className="text-sm text-gray-600 mb-6">Tendrás que volver a iniciar sesión para continuar comprando.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancelar</button>
                            <button onClick={doLogout} className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700">Sí, cerrar sesión</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
