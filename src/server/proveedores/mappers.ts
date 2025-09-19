import type { Supplier } from "@/lib/compras/purchase";

export function mapProveedorRowToSupplierUI(row: any): Supplier {
  return {
    id: String(row.id ?? row.ID ?? ""),
    name: row.nombre ?? row.razonSocial ?? row.razon_social ?? "—",
    code: row.cuil ?? row.cuit ?? row.codigo ?? "",
    email: row.email ?? "",
    phone: row.telefono ?? "",
  };
}

/** Normaliza cualquier forma común de respuesta: {data}, {items}, array plano */
export function extractProveedorRows(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.items)) return json.items;
  // a veces { ok:true, data:{ items:[], meta:{} } }
  if (Array.isArray(json?.data?.items)) return json.data.items;
  return [];
}
