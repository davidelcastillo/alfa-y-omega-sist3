/** Si querés mantener depositos: string[] (solo nombres) */
export function mapDepositosToNames(json: { ok: boolean; data: any[] }): string[] {
  const rows = Array.isArray(json?.data) ? json.data : [];
  return rows.map((d: any) => d?.nombre ?? String(d?.id ?? "—"));
}

/** Alternativa: tipo enriquecido */
export type DepositoUI = {
  id: string;
  name: string;
  ubicacion?: string;
  tipo?: string;
  provincia?: string;
  ciudad?: string;
  estado?: boolean;
};

export function mapDepositoRowToUI(row: any): DepositoUI {
  return {
    id: String(row.id ?? ""),
    name: row.nombre ?? "—",
    ubicacion: row.ubicacion ?? "",
    tipo: row.tipo ?? "",
    provincia: row.provincia ?? "",
    ciudad: row.ciudad ?? "",
    estado: typeof row.estado === "boolean" ? row.estado : undefined,
  };
}
