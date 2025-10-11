"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Preferencias del usuario (persistencia en localStorage)
const LS_LOGGED = "loggedIn";
const LS_USER = "user";          // username
const LS_NAME = "name";          // nombre
const LS_LAST = "lastName";      // apellido
const LS_EMAIL = "email";        // email
const LS_PASS = "password";      // (solo demo)
const LS_CART = "cartItems";     // carrito
const LS_COUPON = "cartCouponCode"; // cupón

// util ARS
const $$ = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// calcula subtotal y total con cupón "lenguaje" (20% off)
function totalsFromStore() {
  try {
    const items = JSON.parse(localStorage.getItem(LS_CART) || "[]") as { price: number; quantity: number }[];
    const coupon = (localStorage.getItem(LS_COUPON) || "").trim().toLowerCase();
    const subtotal = items.reduce((a, it) => a + it.price * it.quantity, 0);
    const factor = coupon === "lenguaje" ? 0.8 : 1;
    const total = subtotal * factor;
    const discount = subtotal - total;
    return { subtotal, total, discount, has: items.length > 0 };
  } catch {
    return { subtotal: 0, total: 0, discount: 0, has: false };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Tabs header
// ──────────────────────────────────────────────────────────────────────────────
function Tabs({ active, onChange }: { active: "login" | "register"; onChange: (t: "login" | "register") => void }) {
  return (
    <ul className="contenedor-tabs flex gap-2 mb-6">
      <li
        className={`tab tab-segunda ${active === "login" ? "active" : ""}`}
        onClick={() => onChange("login")}
      >
        <a href="#iniciar-sesion" className="px-4 py-2 inline-block">Iniciar Sesión</a>
      </li>
      <li
        className={`tab tab-primera ${active === "register" ? "active" : ""}`}
        onClick={() => onChange("register")}
      >
        <a href="#registrarse" className="px-4 py-2 inline-block">Registrarse</a>
      </li>
    </ul>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Login form
// ──────────────────────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // leer "DB" local (demo)
    const storedUsuario = localStorage.getItem(LS_USER);
    const storedContrasena = localStorage.getItem(LS_PASS);

    if (usuario === storedUsuario && contrasena === storedContrasena) {
      localStorage.setItem(LS_LOGGED, "true");
      setError(null);
      onSuccess();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div id="iniciar-sesion" className="glass rounded-2xl p-6">
      <h1 className="text-xl font-bold mb-4">Iniciar Sesión</h1>
      <form id="loginForm" onSubmit={handleSubmit} className="grid gap-4">
        <div className="contenedor-input">
          <label className="text-sm font-medium">Usuario <span className="req">*</span></label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="text" id="loginUsuario" required value={usuario} onChange={e => setUsuario(e.target.value)} />
        </div>

        <div className="contenedor-input">
          <label className="text-sm font-medium">Contraseña <span className="req">*</span></label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="password" id="loginContrasena" required value={contrasena} onChange={e => setContrasena(e.target.value)} />
        </div>

        <p className="forgot text-sm"><a href="#" className="text-slate-500 hover:underline">¿Se te olvidó la contraseña?</a></p>

        {error && <div className="text-rose-600 text-sm">{error}</div>}

        <input type="submit" className="button button-block rounded-xl btn-primary text-white px-4 py-2 font-medium cursor-pointer" value="Iniciar Sesión" />
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Register form
// ──────────────────────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetir, setRepetir] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (contrasena !== repetir) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Guardar en localStorage (demo). En prod, POST a tu API.
    localStorage.setItem(LS_NAME, nombre);
    localStorage.setItem(LS_LAST, apellido);
    localStorage.setItem(LS_USER, usuario);
    localStorage.setItem(LS_EMAIL, email);
    localStorage.setItem(LS_PASS, contrasena);

    setError(null);
    onSuccess();
  }

  return (
    <div id="registrarse" className="glass rounded-2xl p-6">
      <h1 className="text-xl font-bold mb-4">Registrarse</h1>
      <form id="registroForm" onSubmit={handleSubmit} className="grid gap-4">
        <div className="fila-arriba grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="contenedor-input">
            <label className="text-sm font-medium">Nombre <span className="req">*</span></label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="text" id="nombre" required value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div className="contenedor-input">
            <label className="text-sm font-medium">Apellido <span className="req">*</span></label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="text" id="apellido" required value={apellido} onChange={e => setApellido(e.target.value)} />
          </div>
        </div>

        <div className="contenedor-input">
          <label className="text-sm font-medium">Usuario <span className="req">*</span></label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="text" id="usuario" required value={usuario} onChange={e => setUsuario(e.target.value)} />
        </div>

        <div className="contenedor-input">
          <label className="text-sm font-medium">Email <span className="req">*</span></label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="contenedor-input">
          <label className="text-sm font-medium">Contraseña <span className="req">*</span></label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="password" id="contrasena" required value={contrasena} onChange={e => setContrasena(e.target.value)} />
        </div>

        <div className="contenedor-input">
          <label className="text-sm font-medium">Repetir Contraseña <span className="req">*</span></label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm input-focus" type="password" id="repetirContrasena" required value={repetir} onChange={e => setRepetir(e.target.value)} />
        </div>

        {error && <div className="text-rose-600 text-sm">{error}</div>}

        <input type="submit" className="button button-block rounded-xl btn-primary text-white px-4 py-2 font-medium cursor-pointer" value="Registrarse" />
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Mini resumen del carrito (opcional)
// ──────────────────────────────────────────────────────────────────────────────
function PendingSummary() {
  const [t, setT] = useState(() => ({ subtotal: 0, total: 0, discount: 0, has: false }));
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

// ──────────────────────────────────────────────────────────────────────────────
// Página Cuenta (Login / Registro) — sin header/footer; lo aporta tu layout
// ──────────────────────────────────────────────────────────────────────────────
export default function CuentaPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");

  // si ya está logueado, podrías redirigir a /eco/pagos o /eco/inicio
  useEffect(() => {
    if (localStorage.getItem(LS_LOGGED) === "true") {
      // ya está logueado, manda a pagar si hay algo en el carrito
      const hasCart = (JSON.parse(localStorage.getItem(LS_CART) || "[]") as any[]).length > 0;
      router.replace(hasCart ? "/eco/pagos" : "/eco/inicio");
    }
  }, [router]);

  const onLoginSuccess = () => {
    const hasCart = (JSON.parse(localStorage.getItem(LS_CART) || "[]") as any[]).length > 0;
    router.push(hasCart ? "/eco/pagos" : "/eco/inicio");
  };

  const onRegisterSuccess = () => {
    // Feedback simple y switch a login
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
              <RegisterForm onSuccess={onRegisterSuccess} />)
            }
          </div>
        </div>
        <div className="lg:col-span-1">
          <PendingSummary />
        </div>
      </div>
    </main>
  );
}
