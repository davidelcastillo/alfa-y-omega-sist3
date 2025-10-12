// src/lib/eco/http-server.ts
import 'server-only';
import { headers } from 'next/headers';

/** Devuelve el origin absoluto (https://dominio.com) para SSR/Edge. */
export async function getBaseUrlServer() {
  const h = await headers();                  // 👈 ahora sí
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host  = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Host header missing");
  return `${proto}://${host}`;
}
