// src/app/eco/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

/* ================== LocalStorage keys ya usados ================== */
const LS_LOGGED = "loggedIn";
const LS_USER = "user";         // email
const LS_NAME = "name";
const LS_LAST = "lastName";
const LS_EMAIL = "email";
const LS_CART = "cartItems";
const LS_COUPON = "cartCouponCode";

/* ================== Utils ================== */
const $$ = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

function totalsFromStore() {
  try {
    const items = JSON.parse(
      localStorage.getItem(LS_CART) || "[]"
    ) as { price: number; quantity: number }[];
    const coupon = (localStorage.getItem(LS_COUPON) || "")
      .trim()
      .toLowerCase();
    const subtotal = items.reduce((a, it) => a + it.price * it.quantity, 0);
    const factor = coupon === "lenguaje" ? 0.8 : 1;
    const total = subtotal * factor;
    const discount = subtotal - total;
    return { subtotal, total, discount, has: items.length > 0 };
  } catch {
    return { subtotal: 0, total: 0, discount: 0, has: false };
  }
}

/* ================== Tabs ================== */
function Tabs({
  active,
  onChange,
}: {
  active: "login" | "register";
  onChange: (t: "login" | "register") => void;
}) {
  return (
    <ul className="contenedor-tabs flex gap-2 mb-6">
      <li
        className={`tab tab-segunda ${active === "login" ? "active" : ""}`}
        onClick={() => onChange("login")}
      >
        <a href="#iniciar-sesion" className="px-4 py-2 inline-block">
          Iniciar Sesión
        </a>
      </li>
      <li
        className={`tab tab-primera ${active === "register" ? "active" : ""}`}
        onClick={() => onChange("register")}
      >
        <a href="#registrarse" className="px-4 py-2 inline-block">
          Registrarse
        </a>
      </li>
    </ul>
  );
}

/* ================== Login ================== */
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/eco/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: contrasena }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "Error de autenticación");
        return;
      }

      // Persistencia mínima (opcional; la cookie httpOnly ya es la fuente real)
      localStorage.setItem(LS_LOGGED, "true");
      localStorage.setItem(LS_USER, json.user.email ?? "");
      localStorage.setItem(LS_NAME, json.user.nombre ?? "");
      localStorage.setItem(LS_LAST, json.user.apellido ?? "");
      localStorage.setItem(LS_EMAIL, json.user.email ?? "");

      // Notificar al Header para refrescar su estado
      window.dispatchEvent(new Event("eco:auth-changed"));

      onSuccess(); // ✅ SOLO una vez
    } catch {
      setError("No se pudo contactar al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="iniciar-sesion" className="glass rounded-2xl p-6">
      <h1 className="text-xl font-bold mb-4">Iniciar Sesión</h1>
      <form id="loginForm" onSubmit={handleSubmit} className="grid gap-4">
        <div className="contenedor-input">
          <label className="text-sm font-medium">
            Email <span className="req">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="contenedor-input">
          <label className="text-sm font-medium">
            Contraseña <span className="req">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            type="password"
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <p className="forgot text-sm">
          <a href="#" className="text-slate-500 hover:underline">
            ¿Se te olvidó la contraseña?
          </a>
        </p>

        {error && <div className="text-rose-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="button button-block rounded-xl btn-primary text-white px-4 py-2 font-medium"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}

/* ================== Registro ================== */
/* ================== Registro ================== */
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState(""); // 👈 teléfono
  const [contrasena, setContrasena] = useState("");
  const [repetir, setRepetir] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dirección
  const [query, setQuery] = useState(""); // input de búsqueda
  const [direccion, setDireccion] = useState({
    calle: "", numero: "", pisoDepto: "",
    codigoPostal: "", ciudad: "", provincia: "", pais: "Argentina", placeId: "",
  });

  const autoRef = useState<HTMLInputElement | null>(null)[0] as any;
  const setAutoRef = (el: HTMLInputElement | null) => {
    (RegisterForm as any)._autoEl = el;
  };

  // Teléfono simple: + y 8–15 dígitos
  const telNormalized = telefono.replace(/[^\d+]/g, "");
  const telOk = /^\+?\d{8,15}$/.test(telNormalized);

  // Password rules
  const pwRules = {
    len: contrasena.length >= 8,
    lower: /[a-z]/.test(contrasena),
    upper: /[A-Z]/.test(contrasena),
    digit: /\d/.test(contrasena),
    symbol: /[^A-Za-z0-9]/.test(contrasena),
    match: contrasena && contrasena === repetir,
  };
  const pwValid = Object.values(pwRules).every(Boolean);

  // Cargar Google y montar Autocomplete
  useEffect(() => {
    let ac: google.maps.places.Autocomplete | null = null;
    let cancelled = false;

    (async () => {
      const { loadGoogleMaps, parsePlace } = await import("@/lib/eco/maps");
      const g = await loadGoogleMaps();
      const el = (RegisterForm as any)._autoEl as HTMLInputElement | null;
      if (!g || !el) return;

      ac = new g.maps.places.Autocomplete(el, {
        fields: ["address_components", "place_id"],
        types: ["address"],
        componentRestrictions: { country: ["ar"] }, // limitar si querés
      });

      ac.addListener("place_changed", () => {
        if (cancelled) return;
        const place = ac!.getPlace();
        const parsed = parsePlace(place);
        setDireccion((d) => ({ ...d, ...parsed }));
        // En el input visible mostramos calle + número si vino
        const label = [parsed.calle, parsed.numero].filter(Boolean).join(" ");
        setQuery(label || "");
      });
    })();

    return () => { cancelled = true; };
  }, []);

  // Validación mínima de dirección (lo que tu API necesita)
  const dirOk =
    direccion.calle.trim() &&
    direccion.numero.trim() &&
    direccion.codigoPostal.trim() &&
    direccion.ciudad.trim() &&
    direccion.provincia.trim() &&
    direccion.pais.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!telOk) { setError("Teléfono inválido"); return; }
    if (!pwValid) { setError("La contraseña no cumple los requisitos"); return; }
    if (!dirOk) { setError("Completá la dirección (calle, número, CP, ciudad, provincia, país)"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/eco/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          telefono: telNormalized,
          password: contrasena,
          direccion,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "No se pudo registrar");
        return;
      }
      onSuccess();
    } catch {
      setError("No se pudo contactar al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="registrarse" className="glass rounded-2xl p-6">
      <h1 className="text-xl font-bold mb-4">Registrarse</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Nombre / Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nombre *</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              value={nombre} onChange={e=>setNombre(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Apellido *</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              value={apellido} onChange={e=>setApellido(e.target.value)} required />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email *</label>
          <input type="email" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>

        {/* Teléfono */}
        <div>
          <label className="text-sm font-medium">Teléfono *</label>
          <input
            type="tel"
            inputMode="tel"
            placeholder="+5491122334455"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            value={telefono}
            onChange={e=>setTelefono(e.target.value)}
            required
          />
          {!telOk && telefono && (
            <p className="text-xs text-amber-600 mt-1">Use + y 8–15 dígitos.</p>
          )}
        </div>

        {/* Buscar dirección (Autocomplete) */}
        <div>
          <label className="text-sm font-medium">Buscar dirección *</label>
          <input
            ref={setAutoRef}
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Escribí tu dirección y elegí de la lista…"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
          />
        </div>

        {/* Campos de dirección (editables) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Calle *</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              value={direccion.calle}
              onChange={e=>setDireccion(d=>({ ...d, calle: e.target.value }))}
              required />
          </div>
          <div>
            <label className="text-sm font-medium">Número *</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              value={direccion.numero}
              onChange={e=>setDireccion(d=>({ ...d, numero: e.target.value }))}
              required />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Piso/Depto</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            value={direccion.pisoDepto ?? ""}
            onChange={e=>setDireccion(d=>({ ...d, pisoDepto: e.target.value }))} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Código Postal *</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              value={direccion.codigoPostal}
              onChange={e=>setDireccion(d=>({ ...d, codigoPostal: e.target.value }))}
              required />
          </div>
          <div>
            <label className="text-sm font-medium">Ciudad *</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              value={direccion.ciudad}
              onChange={e=>setDireccion(d=>({ ...d, ciudad: e.target.value }))}
              required />
          </div>
          <div>
            <label className="text-sm font-medium">Provincia *</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
              value={direccion.provincia}
              onChange={e=>setDireccion(d=>({ ...d, provincia: e.target.value }))}
              required />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">País *</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            value={direccion.pais}
            onChange={e=>setDireccion(d=>({ ...d, pais: e.target.value }))} required />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium">Contraseña *</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            value={contrasena}
            onChange={e=>setContrasena(e.target.value)}
            required
          />
          <ul className="mt-2 text-xs grid grid-cols-2 gap-y-1 text-gray-600">
            <li className={pwRules.len ? "text-emerald-600" : ""}>• 8+ caracteres</li>
            <li className={pwRules.lower ? "text-emerald-600" : ""}>• minúscula</li>
            <li className={pwRules.upper ? "text-emerald-600" : ""}>• mayúscula</li>
            <li className={pwRules.digit ? "text-emerald-600" : ""}>• número</li>
            <li className={pwRules.symbol ? "text-emerald-600" : ""}>• símbolo</li>
          </ul>
        </div>

        {/* Repetir */}
        <div>
          <label className="text-sm font-medium">Repetir Contraseña *</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus"
            value={repetir}
            onChange={e=>setRepetir(e.target.value)}
            required
          />
          {repetir && !pwRules.match && (
            <p className="text-xs text-rose-600 mt-1">Las contraseñas no coinciden.</p>
          )}
        </div>

        {error && <div className="text-rose-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading || !pwValid || !telOk || !dirOk}
          className="button button-block rounded-xl btn-primary text-white px-4 py-2 font-medium"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}


/* ================== Resumen carrito ================== */
function PendingSummary() {
  const [t, setT] = useState(() => ({
    subtotal: 0,
    total: 0,
    discount: 0,
    has: false,
  }));
  useEffect(() => {
    setT(totalsFromStore());
  }, []);
  if (!t.has) return null;
  return (
    <div className="glass rounded-2xl p-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-slate-600">Total pendiente</span>
        <span className="font-semibold">{$$(t.total)}</span>
      </div>
    </div>
  );
}

/* ================== Página ================== */
export default function CuentaPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");

  // ✅ Guard: verificar en el servidor (cookie)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/eco/yo", { method: "POST" });
        if (!res.ok) {
          // no hay sesión válida; limpiar bandera vieja
          localStorage.removeItem(LS_LOGGED);
          return;
        }
        const hasCart = (
          JSON.parse(localStorage.getItem(LS_CART) || "[]") as any[]
        ).length > 0;
        if (!cancelled) {
          router.replace(hasCart ? "/eco/pagos" : "/eco/inicio");
        }
      } catch {
        localStorage.removeItem(LS_LOGGED);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const onLoginSuccess = () => {
    const hasCart = (
      JSON.parse(localStorage.getItem(LS_CART) || "[]") as any[]
    ).length > 0;
    router.push(hasCart ? "/eco/pagos" : "/eco/inicio");
  };

  const onRegisterSuccess = () => {
    alert("Registro exitoso");
    setTab("login");
  };

  return (
    <main className="section py-8">
      <div className="contenedor-formularios grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs active={tab} onChange={setTab} />
          <div className="contenido-tab space-y-6">
            {tab === "login" ? (
              <LoginForm onSuccess={onLoginSuccess} />
            ) : (
              <RegisterForm onSuccess={onRegisterSuccess} />
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <PendingSummary />
        </div>
      </div>
    </main>
  );
}
