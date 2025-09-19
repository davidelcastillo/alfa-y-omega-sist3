import "server-only";
import { fetchDepositos, type DepositosQuery } from "./api-client";
import { mapDepositosToNames, mapDepositoRowToUI, type DepositoUI } from "./mappers";

/** Si tu UI espera string[] */
export async function getDepositosNamesService(q: DepositosQuery = {}): Promise<string[]> {
  const json = await fetchDepositos(q);
  return mapDepositosToNames(json);
}

/** Si querés exponer también forma enriquecida */
export async function getDepositosService(q: DepositosQuery = {}): Promise<DepositoUI[]> {
  const json = await fetchDepositos(q);
  const rows = Array.isArray(json?.data) ? json.data : [];
  return rows.map(mapDepositoRowToUI);
}
