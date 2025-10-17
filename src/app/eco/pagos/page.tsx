"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ================== Tipos ================== */
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

/* ================== Utils ================== */
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
      .slice(0, 16)
      .padEnd(16, "0")
      .match(/.{1,4}/g)
      ?.join(" ") || "0000 0000 0000 0000";

  const shownName = name || "Jane Appleseed";
  const shownMonth = (month || "").padEnd(2, "0").slice(0, 2) || "00";
  const shownYear = (year || "").padEnd(2, "0").slice(0, 2) || "00";
  const shownCvc = (cvc || "").replace(/[^0-9]/g, "").padEnd(3, "0").slice(0, 3) || "000";

  return (
    <div className="card-area grid gap-6">
      {/* Frente */}
      <div className="relative h-[200px] sm:h-[230px] md:h-[250px] w-[330px] sm:w-[360px] md:w-[400px] rounded-xl overflow-hidden shadow-lg">
        <Image
          //src="/bg-card-front.png"
          src="https://res.cloudinary.com/dqulznz36/image/upload/f_auto,q_auto/v1760704598/bg-card-front_fn91im.png"
          alt="Frente de la tarjeta"
          fill
          className="object-cover"
          priority
        />

        {/* Datos abajo */}
        <div className="absolute inset-x-0 bottom-4 px-5 text-white">
          <p className="card-number text-lg sm:text-xl tracking-[0.25em] tabular-nums">
            {shownNumber}
          </p>
          <div className="card-name-date mt-2 flex items-center justify-between">
            <p className="card-name text-sm sm:text-base truncate pr-2">{shownName}</p>
            <p className="card-date text-sm sm:text-base">
              {shownMonth}/{shownYear}
            </p>
          </div>
        </div>
      </div>

      {/* Dorso */}
      <div className="relative h-[200px] sm:h-[230px] md:h-[250px] w-[330px] sm:w-[360px] md:w-[400px] rounded-xl overflow-hidden shadow-lg">
        <Image
          //src="/bg-card-back.png"
          src="https://res.cloudinary.com/dqulznz36/image/upload/v1760704598/bg-card-back_ek6kbn.png"
          alt="Dorso de la tarjeta"
          fill
          className="object-cover"
        />
        <div className="absolute right-8 top-[84px] sm:top-[96px] md:top-[108px]">
          <p className="card-cvc inline-block bg-white/90 text-slate-900 rounded px-2 py-1 tabular-nums">
            {shownCvc}
          </p>
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
  onSuccess: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formateo básico (Cleave-like)
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
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      // simulación de gateway
      await new Promise((r) => setTimeout(r, 900));
      await onSuccess();
    } catch (e: any) {
      setError(e?.message || "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      <div className="justify-self-center">
        <CardPreview number={number} name={name} month={month} year={year} cvc={cvc} />
      </div>

      <form className="form-wrapper w-full max-w-md" onSubmit={onSubmit}>
        <div className="form glass rounded-2xl p-6 md:p-7 space-y-5">
          <div className="form-group">
            <label className="label text-sm font-medium">Titular de Tarjeta</label>
            <input
              className="input mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              placeholder="ej. Fulanito de Tal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label text-sm font-medium">Número de tarjeta</label>
            <input
              className="input mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus tabular-nums"
              placeholder="ej. 1234 5678 9123 0000"
              value={number}
              onChange={(e) => onNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group grid grid-cols-2 gap-4">
            <div className="rows">
              <label className="label text-sm font-medium">Fecha exp. (MM/AA)</label>
              <div className="columns grid grid-cols-2 gap-2">
                <input
                  className="input mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
                  placeholder="MM"
                  value={month}
                  onChange={(e) => onMonth(e.target.value)}
                  maxLength={2}
                  required
                />
                <input
                  className="input mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
                  placeholder="AA"
                  value={year}
                  onChange={(e) => onYear(e.target.value)}
                  maxLength={2}
                  required
                />
              </div>
            </div>

            <div className="rows">
              <label className="label text-sm font-medium">Cod. Seg.</label>
              <input
                className="input mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
                placeholder="ej. 123"
                value={cvc}
                onChange={(e) => onCvc(e.target.value)}
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="form-group text-sm">
            <label className="label text-slate-600">
              Total a pagar: <span className="font-semibold">{money(total)}</span>
            </label>
          </div>

          {error && <div className="text-rose-600 text-sm">{error}</div>}

          <div className="form-group grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="button rounded-xl border px-4 py-2 font-medium hover:bg-slate-50"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="button rounded-xl btn-primary text-white px-4 py-2 font-medium disabled:opacity-70"
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
    <div className="thank-you glass rounded-2xl p-10 text-center max-w-md mx-auto">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-600">
          <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      </div>
      <h3 className="thank-you-title text-lg font-semibold">¡Gracias!</h3>
      <p className="thank-you-text text-slate-600">Esperamos que disfrutes de tu compra.</p>
      <button
        onClick={onContinue}
        className="mt-6 button rounded-xl btn-primary text-white px-4 py-2 font-medium"
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

    if (!lsItems.length) {
      const legacyTotal = parseFloat(sessionStorage.getItem("discountedSubtotal") || "NaN");
      if (!Number.isFinite(legacyTotal)) {
        router.replace("/eco/carrito");
        return;
      }
    }

    setItems(lsItems);
    setCoupon(coup);
  }, [router]);

  const totals = useMemo(() => computeTotals(items, coupon), [items, coupon]);

  const onSuccess = async () => {
    const direccionEnvioId = 1;
    const metodoEnvioId = 1;

    // Llamada a la nueva API de pedidos
    const res = await fetch("/api/eco/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direccionEnvioId, metodoEnvioId }),
      credentials: "include",
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "No se pudo confirmar el pedido");

    try {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem(COUPON_LS);
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("cartTotalCount");
      sessionStorage.removeItem("discountedSubtotal");
      // Disparar evento para actualizar el header
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } finally {
      setDone(true);
    }
  };

  const onCancel = () => router.push("/eco/carrito");
  const goHome = () => router.push("/eco/inicio");

  return (
    <main className="wrapper min-h-[calc(100vh-5rem)] py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-2xl font-bold tracking-tight mb-8">Pago</h1>
        {done ? (
          <ThankYou onContinue={goHome} />
        ) : (
          <PaymentForm total={totals.total} onSuccess={onSuccess} onCancel={onCancel} />
        )}
      </div>
    </main>
  );
}
