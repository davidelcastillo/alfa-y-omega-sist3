import "server-only";

export type ProveedoresQuery = {
  page?: number | string;
  limit?: number | string;
  search?: string;
  cuil?: string;
  razon_social?: string;
  categoria_fiscal?: string;
  provincia?: string;
  localidad?: string;
  pais?: string;
  sort?: string;      // ej: "nombre:desc"
  status?: "active" | "inactive" | "all";
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function fetchProveedores(q: ProveedoresQuery = {}) {
  const base = getBaseUrl();
  const url = new URL("/api/proveedores", base);
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`[GET /api/proveedores] ${res.status}`);

  // Tu endpoint devuelve lo que retorna listarProveedores(q).
  // Según tu POST, suele usarse { ok, data, ... } o { data, meta }.
  return res.json() as Promise<any>;
}
