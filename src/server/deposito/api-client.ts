import "server-only";

export type DepositosQuery = {
  search?: string;
  tipo?: string;
  estado?: "Activo" | "Inactivo" | ""; // tu API usa 'estado === "Activo"' para true
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function fetchDepositos(q: DepositosQuery = {}) {
  const base = getBaseUrl();
  const url = new URL("/api/deposito", base);
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`[GET /api/deposito] ${res.status}`);
  return res.json() as Promise<{ ok: boolean; data: any[] }>;
}
