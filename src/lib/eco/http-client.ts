// src/lib/eco/http-client.ts
/** Devuelve el origin en el navegador. No usar en SSR. */
export function getBaseUrlClient() {
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}
