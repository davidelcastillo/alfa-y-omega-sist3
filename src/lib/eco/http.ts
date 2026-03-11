// src/lib/eco/http.ts
import 'server-only';
import { headers } from 'next/headers';

/** Devuelve el origin absoluto (https://dominio.com) para SSR/Edge. */
export async function getBaseUrl() {
  // 1) Intento con headers del request (proxy-friendly)
  try {
    const h = await headers(); // 👈 importante el await
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const host  = h.get('x-forwarded-host') ?? h.get('host');
    if (host) return `${proto}://${host}`;
  } catch {
    // puede fallar en build/background
  }

  // 2) Fallbacks para build/ISR/entornos sin headers
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL)           return `https://${process.env.VERCEL_URL}`;

  // 3) Dev local
  return 'http://localhost:3000';
}
