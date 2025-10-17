"use client";

import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation"; // Se elimina la dependencia de Next.js
import Link from "next/link";
// ──────────────────────────────────────────────────────────────────────────────
// Tipos y helpers
// ──────────────────────────────────────────────────────────────────────────────
export type CartItem = {
  id: number | string;
  name: string;
  description?: string | null;
  image: string;
  price: number; // unitario
  quantity: number;
  stock?: number | null;
};

const LS_KEY = "cartItems"; // carrito persistido (tu preferencia)
const SS_KEY = "cartItems"; // por compatibilidad con tu HTML anterior
const COUPON_LS = "cartCouponCode";

const $$ = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

function readStore<T>(key: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Subcomponentes (en este mismo archivo para no armar spaguetti)
// Si preferís, podés moverlos a src/components/eco/cart/*
// ──────────────────────────────────────────────────────────────────────────────
function CartHeader({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold tracking-tight">CARRITO <span className="text-slate-500">({count})</span></h1>
      {count > 0 && (
        <button onClick={onClear} className="text-sm text-rose-600 hover:text-rose-700 hover:underline" aria-label="Vaciar carrito">[BORRAR]</button>
      )}
    </div>
  );
}

function CartItemRow({ it, onInc, onDec, onRemove }: {
  it: CartItem;
  onInc: (id: CartItem["id"]) => void;
  onDec: (id: CartItem["id"]) => void;
  onRemove: (id: CartItem["id"]) => void;
}) {
  return (
    <article className="glass rounded-2xl p-4 flex items-center gap-4 card-hover">
      {/* imagen */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/40 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={it.image || "/placeholder.png"} alt={it.name} className="h-full w-full object-cover" />
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{it.name}</h3>
        {it.description && <p className="text-sm text-slate-500 line-clamp-2">{it.description}</p>}
        <div className="mt-2 text-sm text-slate-600">
          <span className="font-medium">{$$(it.price)}</span>
          {typeof it.stock === "number" && <span className="ml-2 text-xs text-slate-500">Stock: {it.stock}</span>}
        </div>
      </div>

      {/* cantidad */}
      <div className="flex items-center gap-2">
        <button onClick={() => onDec(it.id)} className="h-9 w-9 rounded-lg border border-slate-300 hover:bg-slate-50" aria-label={`Restar ${it.name}`}>−</button>
        <span className="w-8 text-center tabular-nums">{it.quantity}</span>
        <button onClick={() => onInc(it.id)} className="h-9 w-9 rounded-lg border border-slate-300 hover:bg-slate-50" aria-label={`Sumar ${it.name}`}>+</button>
      </div>

      {/* total + eliminar */}
      <div className="flex flex-col items-end gap-2 min-w-[110px]">
        <div className="text-right font-semibold">{$$(it.price * it.quantity)}</div>
        <button onClick={() => onRemove(it.id)} className="text-sm text-rose-600 hover:text-rose-700" aria-label={`Eliminar ${it.name}`}>Eliminar</button>
      </div>
    </article>
  );
}

function CartList({ items, onInc, onDec, onRemove }: {
  items: CartItem[];
  onInc: (id: CartItem["id"]) => void;
  onDec: (id: CartItem["id"]) => void;
  onRemove: (id: CartItem["id"]) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-slate-600">Tu carrito está vacío.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <CartItemRow key={String(it.id)} it={it} onInc={onInc} onDec={onDec} onRemove={onRemove} />
      ))}
    </div>
  );
}

function CartSummary({ subtotal, discount, total, coupon, onChangeCoupon }: {
  subtotal: number;
  discount: number;
  total: number;
  coupon: string;
  onChangeCoupon: (v: string) => void;
}) {
  const showTag = coupon.trim().toLowerCase() === "sistemas";  //para el descuento
  return (
    <aside className="sticky top-24">
      <div className="glass rounded-2xl p-5">
        <input
          type="text"
          value={coupon}
          onChange={(e) => onChangeCoupon(e.target.value)}
          placeholder="INGRESE CÓDIGO"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm input-focus"
        />
        <div className="space-y-2 text-sm mt-4">
          <div className="flex justify-between text-slate-600"><span>SUBTOTAL</span><span>{$$(subtotal)}</span></div>
          <div className="flex justify-between text-slate-600"><span>DESCUENTO {showTag ? "(20%)" : ""}</span><span>{$$(discount)}</span></div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between text-base font-semibold"><span>TOTAL</span><span>{$$(total)}</span></div>
        </div>
      </div>
    </aside>
  );
}

function CartActions({ onCheckout, onContinue }: { onCheckout: () => void; onContinue: () => void }) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-2">
      <button onClick={onCheckout} className="rounded-xl btn-primary text-white px-4 py-2 font-medium">COMPRAR YA</button>
      <button onClick={onContinue} className="rounded-xl border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50">Seguir comprando</button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Página Carrito (solo el contenedor principal; tu layout aporta header/footer)
// ──────────────────────────────────────────────────────────────────────────────
export default function CarritoPage() {
  // const router = useRouter(); // Se elimina la dependencia de Next.js

  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false); // Evita sobreescribir el LS al cargar

  // Función para recargar el estado desde localStorage
  const loadCart = () => {
    if (typeof window === "undefined") return;

    const fromLS = readStore<CartItem[]>(LS_KEY, []);
    const fromSS = (() => {
      try { return JSON.parse(sessionStorage.getItem(SS_KEY) || "[]") as CartItem[]; } catch { return [] as CartItem[]; }
    })();

    const base = fromLS.length ? fromLS : fromSS;
    if (fromSS.length && !fromLS.length) localStorage.setItem(LS_KEY, JSON.stringify(fromSS));

    setItems(base);

    const savedCoupon = (localStorage.getItem(COUPON_LS) ?? "").trim();
    if (savedCoupon) setCoupon(savedCoupon);
  };

  // Carga inicial y escucha de cambios
  useEffect(() => {
    loadCart();
    setIsHydrated(true); // Marca que la carga inicial desde LS ha terminado

    // MEJORA: Escuchamos el evento personalizado 'cart:changed' para recargar.
    window.addEventListener('cart:changed', loadCart);

    // Limpiamos el listener cuando el componente se desmonta.
    return () => {
      window.removeEventListener('cart:changed', loadCart);
    };
  }, []);

  // Persistencia de items
  useEffect(() => {
    if (!isHydrated) return; // No guardar en LS hasta que se haya cargado el estado inicial
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items, isHydrated]);
  
  // Persistencia del cupón
  useEffect(() => {
    if (!isHydrated) return; // No guardar en LS hasta que se haya cargado el estado inicial
    if (typeof window !== "undefined") {
      localStorage.setItem(COUPON_LS, coupon);
    }
  }, [coupon, isHydrated]);

  // Totales y contador
  const { count, subtotal, discount, total } = useMemo(() => {
    const count = items.reduce((a, it) => a + (it.quantity || 0), 0);
    const subtotal = items.reduce((a, it) => a + it.price * it.quantity, 0);
    const factor = coupon.trim().toLowerCase() === "sistemas" ? 0.8 : 1;
    const total = subtotal * factor;
    const discount = subtotal - total;
    return { count, subtotal, discount, total };
  }, [items, coupon]);

  // Handlers core
  const inc = (id: CartItem["id"]) =>
    setItems((prev) => prev.map((it) => {
      if (it.id !== id) return it;
      const next = (it.quantity || 0) + 1;
      if (typeof it.stock === "number" && it.stock !== null) {
        return { ...it, quantity: Math.min(next, Math.max(0, it.stock)) };
      }
      return { ...it, quantity: next };
    }));

  const dec = (id: CartItem["id"]) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: Math.max(0, (it.quantity || 0) - 1) } : it)).filter((it) => it.quantity > 0));

  const removeOne = (id: CartItem["id"]) => setItems((prev) => prev.filter((it) => it.id !== id));

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LS_KEY);
      // limpieza legacy
      sessionStorage.removeItem("cartTotalCount");
      sessionStorage.removeItem("discountedSubtotal");
    }
  };

  const onChangeCoupon = (v: string) => {
    setCoupon(v);
  };

  // Navegación propia de tu app
  const continuar = () => {
    window.location.href = "/eco/productos";
  };

  const comprarYa = () => {
    window.location.href = "/eco/login";
  };
  //const comprarYa = () => window.location.href = "/eco/pagos"; // realmente deberia redirigir a cuenta para ver si esta registrado

  return (
    <div className="section py-8">
      <div className="cart-container">
        <CartHeader count={count} onClear={clearCart} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
          {/* Lista */}
          <div className="lg:col-span-2">
            <CartList items={items} onInc={inc} onDec={dec} onRemove={removeOne} />
          </div>

          {/* Summary + Botones */}
          <div className="lg:col-span-1">
            <CartSummary subtotal={subtotal} discount={discount} total={total} coupon={coupon} onChangeCoupon={onChangeCoupon} />
            <CartActions onCheckout={comprobarStockBeforeCheckout(comprarYa)} onContinue={continuar} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook simple para validar/prevenir checkout si no hay items (extensible a validaciones con API)
function comprobarStockBeforeCheckout(go: () => void) {
  return () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? (JSON.parse(raw) as CartItem[]) : [];
      if (!arr.length) return; // nada que comprar
      // Aquí podrías llamar a /api/eco/cart/validate para reconfirmar precios/stock
      go();
    } catch {
      go();
    }
  };
}