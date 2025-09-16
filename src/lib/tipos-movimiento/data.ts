// src/lib/tipos-movimiento/data.ts
export type TipoMovimientoDTO = {
  id: number;
  nombre: string;
  saldo: boolean; // o ingresoEgreso: boolean, según tu DB
};

export async function fetchTiposMovimiento(): Promise<TipoMovimientoDTO[]> {
  const res = await fetch("/api/tipos-movimiento", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener tipos de movimiento");
  const json = await res.json();
  return json.data as TipoMovimientoDTO[];
}
