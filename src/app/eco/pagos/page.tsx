// src/app/eco/pagos/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Si ya definiste CartItem en otro archivo, importalo.
// Si no, dejá este tipo acá:
type CartItem = {
  id: number | string;
  name: string;
  description?: string | null;
  image: string;
  price: number;
  quantity: number;
  stock?: number | null;
};

const LS_KEY = "cartItems";
const COUPON_LS = "cartCouponCode";

const money = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

function readJSON<T>(key: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
}

function computeTotals(items: CartItem[], coupon: string) {
  const subtotal = items.reduce((a, it) => a + it.price * it.quantity, 0);
  const factor = coupon.trim().toLowerCase() === "lenguaje" ? 0.8 : 1;
  const total = subtotal * factor;
  const discount = subtotal - total;
  return { subtotal, discount, total };
}

/* ───────────────── CardPreview ───────────────── */
function CardPreview({
  number,
  name,
  month,
  year,
  cvc,
}: {
  number: string;
  name: string;
  month: string;
  year: string;
  cvc: string;
}) {
  const shownNumber =
    (number || "")
      .replace(/[^0-9]/g, "")
      .padEnd(16, "0")
      .match(/.{1,4}/g)
      ?.join(" ") || "0000 0000 0000 0000";

  const shownName = name || "Jane Appleseed";
  const shownMonth = month || "00";
  const shownYear = year || "00";
  const shownCvc =
    (cvc || "").replace(/[^0-9]/g, "").padEnd(3, "0").slice(0, 3) || "000";

  return (
    <div className="relative grid gap-4 sm:grid-cols-2">
      {/* Frente */}
      <div className="relative glass rounded-2xl overflow-hidden p-4 gradient-brand text-white min-h-[180px]">
        <div className="absolute inset-0 opacity-10" />
        <div className="flex flex-col h-full justify-end">
          <div className="text-lg tracking-widest tabular-nums">
            {shownNumber}
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="truncate pr-2">{shownName}</span>
            <span>
              {shownMonth}/{shownYear}
            </span>
          </div>
        </div>
      </div>
      {/* Dorso */}
      <div className="relative glass rounded-2xl overflow-hidden p-4 min-h-[180px] bg-slate-900 text-white">
        <div className="h-8 -mx-4 bg-slate-700/80" />
        <div className="mt-6 text-right pr-2">
          <span className="inline-block bg-white/90 text-slate-900 rounded px-2 py-1 tabular-nums">
            {shownCvc}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── PaymentForm ───────────────── */
function PaymentForm({
  total,
  onSuccess,
  onCancel,
}: {
  total: number;
  onSuccess: () => Promise<void> | void;  // 👈 permitir async
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formateo básico
  const onNumber = (v: string) =>
    setNumber(
      v.replace(/[^0-9]/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
    );
  const onMonth = (v: string) => setMonth(v.replace(/[^0-9]/g, "").slice(0, 2));
  const onYear = (v: string) => setYear(v.replace(/[^0-9]/g, "").slice(0, 2));
  const onCvc = (v: string) => setCvc(v.replace(/[^0-9]/g, "").slice(0, 3));

  function validate(): string | null {
    if (!name.trim()) return "Ingresá el titular.";
    const digits = number.replace(/\s+/g, "");
    if (digits.length !== 16) return "Número de tarjeta inválido.";
    const m = parseInt(month || "0", 10);
    if (!(m >= 1 && m <= 12)) return "Mes inválido.";
    if ((year || "").length !== 2) return "Año inválido.";
    if (cvc.length !== 3) return "CVC inválido.";
    return null;
  }

  const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const err = validate();
      if (err) { setError(err); return; }
      setError(null);
      setSubmitting(true);

      try {
        await new Promise((r) => setTimeout(r, 900)); // simulación
        await onSuccess();                            // 👈 await
      } catch (e: any) {
        setError(e?.message || "Ocurrió un error");
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <CardPreview
        number={number}
        name={name}
        month={month}
        year={year}
        cvc={cvc}
      />

      <form className="glass rounded-2xl p-5" onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Titular de Tarjeta</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              placeholder="ej. Fulanito de Tal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Número de tarjeta</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus tabular-nums"
              placeholder="1234 5678 9123 0000"
              value={number}
              onChange={(e) => onNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha exp. (MM/AA)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
                  placeholder="MM"
                  value={month}
                  onChange={(e) => onMonth(e.target.value)}
                  required
                />
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
                  placeholder="AA"
                  value={year}
                  onChange={(e) => onYear(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Cod. Seg.</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
                placeholder="123"
                value={cvc}
                onChange={(e) => onCvc(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-2 text-sm">
            <span className="text-slate-500">Total a pagar:</span>{" "}
            <span className="font-semibold">{money(total)}</span>
          </div>

          {error && <div className="text-rose-600 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border px-4 py-2 font-medium hover:bg-slate-50"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl btn-primary text-white px-4 py-2 font-medium disabled:opacity-70"
            >
              {submitting ? "Procesando…" : "Confirmar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ───────────────── ThankYou ───────────────── */
function ThankYou({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-600">
          <path
            fill="currentColor"
            d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">¡Gracias!</h3>
      <p className="text-slate-600">Esperamos que disfrutes de tu compra.</p>
      <button
        onClick={onContinue}
        className="mt-6 rounded-xl btn-primary text-white px-4 py-2 font-medium"
      >
        Ir a inicio
      </button>
    </div>
  );
}

/* ───────────────── Page ───────────────── */
export default function PagosPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string>("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lsItems = readJSON<CartItem[]>(LS_KEY, []);
    const coup = (localStorage.getItem(COUPON_LS) ?? "").trim();

    // Si vienen directo sin items, intentamos fallback legacy;
    // si no hay, volvemos a carrito.
    if (!lsItems.length) {
      const legacyTotal = parseFloat(
        sessionStorage.getItem("discountedSubtotal") || "NaN"
      );
      if (!Number.isFinite(legacyTotal)) {
        router.replace("/eco/carrito");
        return;
      }
    }

    setItems(lsItems);
    setCoupon(coup);
  }, [router]);

  const totals = useMemo(() => computeTotals(items, coupon), [items, coupon]);

  const onSuccess = async () => {                 // 👈 ahora async
    // TODO: reemplazar por valores reales seleccionados por el usuario
    const direccionEnvioId = 1;                   // 👈 placeholder válido
    const metodoEnvioId = 1;                      // 👈 placeholder válido

    const res = await fetch("/api/eco/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direccionEnvioId, metodoEnvioId }), // 👈 sin comentarios
      credentials: "include",
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "No se pudo confirmar el pedido");

    // limpiar carrito local siempre que el checkout haya sido OK
    try {
      localStorage.removeItem(LS_KEY);
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("cartTotalCount");
      sessionStorage.removeItem("discountedSubtotal");
    } finally {
      setDone(true);
    }
  };

  const onCancel = () => router.push("/eco/carrito");
  const goHome = () => router.push("/eco/inicio");

  return (
    <main className="section py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Pago</h1>
      {done ? (
        <ThankYou onContinue={goHome} />
      ) : (
        <PaymentForm total={totals.total} onSuccess={onSuccess} onCancel={onCancel} />
      )}
    </main>
  );
}
