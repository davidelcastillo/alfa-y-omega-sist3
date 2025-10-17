import { DashboardResumenSchema, type DashboardResumen, DashboardResumenQuerySchema } from "./types";

async function getBaseUrl() {
    if (typeof window !== "undefined") return "";
    try {
        const { headers } = await import("next/headers");
        const h = await headers();
        const proto = h.get("x-forwarded-proto") ?? "http";
        const host = h.get("x-forwarded-host") ?? h.get("host");
        if (host) return `${proto}://${host}`;
    } catch { }
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
}

function qs(params: Record<string, unknown>) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
    });
    const s = sp.toString();
    return s ? `?${s}` : "";
}

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    return json as T;
}

export async function apiGetDashboardResumen(params: {
    desde: string; hasta: string; gran: "dia" | "mes";
}): Promise<DashboardResumen> {
    const q = DashboardResumenQuerySchema.parse(params);
    const base = await getBaseUrl();
    const url = `${base}/api/dashboard/resumen${qs(q)}`;
    const json = await fetchJson<{ ok: boolean; data: unknown }>(url);
    if (!json.ok) throw new Error("Error en resumen");
    return DashboardResumenSchema.parse(json.data);
}
