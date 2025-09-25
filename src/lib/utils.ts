import { clsx, type ClassValue } from "clsx"  //hay que hacer npm install clsx
import { twMerge } from "tailwind-merge" //hay que hacer npm install tailwind

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// lib/utils.ts
import { z } from "zod";

export function parseSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  sp: URLSearchParams
): z.infer<T> {
  const raw: Record<string, any> = {};
  for (const [k, v] of sp.entries()) raw[k] = v;

  if (raw.page) raw.page = Number(raw.page);
  if (raw.limit) raw.limit = Number(raw.limit);
  if (raw.estado !== undefined) raw.estado = raw.estado === "true";
  if (raw.proveedorId) raw.proveedorId = Number(raw.proveedorId);
  if (raw.depositoId) raw.depositoId = Number(raw.depositoId);

  return schema.parse(raw);
}

export function toQuery(params: Record<string, any>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// fetch JSON + validación opcional con zod
export async function httpJSON<T>(
  input: RequestInfo,
  init?: RequestInit,
  schema?: { parse: (x: any) => T }
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  const data = (await res.json()) as unknown;
  return schema ? schema.parse(data) : (data as T);
}
