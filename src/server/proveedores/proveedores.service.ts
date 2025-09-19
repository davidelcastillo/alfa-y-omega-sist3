import "server-only";
import type { Supplier } from "@/lib/compras/purchase";
import { fetchProveedores, type ProveedoresQuery } from "./api-client";
import { extractProveedorRows, mapProveedorRowToSupplierUI } from "./mappers";

export async function getSuppliersService(q: ProveedoresQuery = {}): Promise<Supplier[]> {
  const json = await fetchProveedores(q);
  const rows = extractProveedorRows(json);
  return rows.map(mapProveedorRowToSupplierUI);
}
