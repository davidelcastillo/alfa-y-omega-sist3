// src/lib/comprobante/utils.ts
import type { ComprobanteFiltersState, ComprobanteProveedor, SortState } from "./comprobante";

export function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

// Aplica filtros al arreglo de órdenes
export function applyFilters(data: ComprobanteProveedor[], f: ComprobanteFiltersState): ComprobanteProveedor[] {
  let out = [...data];
  if (f.numeroCP) {
    const q = f.numeroCP.toLowerCase();
    out = out.filter((o) => {
      const values = [o.nroComprobante, o.numero, o.id]
        .map((v) => (v == null ? "" : String(v).toLowerCase()));
      return values.some((v) => v.includes(q));
    });
  }
  if (f.proveedorId) {
    out = out.filter((o) => String(o.proveedor?.id ?? "") === String(f.proveedorId));
  }
  if (f.depositoId) {
    out = out.filter((o) => String(o.deposito?.id ?? "") === String(f.depositoId));
  }


  // Rango de fechas (creationDate dd/mm/yyyy vs filtros yyyy-mm-dd)
  const from = f.fechaDesde ? new Date(f.fechaDesde) : null;
  const to = f.fechaHasta ? new Date(f.fechaHasta) : null;
  if (from || to) {
    out = out.filter((o) => {
      const fecha = o.fecha ?? o.hora ?? null;
      const d = fecha ? new Date(fecha) : null;
      if (!d) return true;
      if (from && d < from) return false;
      if (to) {
        // incluir el día "hasta"
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }
  return out;
}

// Ordenamiento
export function applySort(data: ComprobanteProveedor[], sort?: SortState): ComprobanteProveedor[] {
  if (!sort) return data;
  const { key, dir } = sort;
  const s = [...data].sort((a, b) => {
    let av: string | number = "";
    let bv: string | number = "";
    switch (key) {
      case "id":
        av = String(a.id ?? ""); bv = String(b.id ?? ""); break;
      case "fecha": {
        const ad = a.fecha ? new Date(a.fecha).getTime() : 0;
        const bd = b.fecha ? new Date(b.fecha).getTime() : 0;
        av = ad; bv = bd; break;
      }
      case "proveedor":
        av = (a.proveedor?.name ?? "").toLowerCase();
        bv = (b.proveedor?.name ?? "").toLowerCase();
        break;

      case "deposito":
        av = (a.deposito?.name ?? "").toLowerCase();
        bv = (b.deposito?.name ?? "").toLowerCase();
        break;

      case "numero":
        av = String(a.numero ?? "");
        bv = String(b.numero ?? "");
        break;

      case "total":
        av = a.total;
        bv = b.total;
        break;

      case "saldo":
        av = a.saldo;
        bv = b.saldo;
        break;

      case "estado":
        av = a.estado ? 1 : 0;
        bv = b.estado ? 1 : 0;
        break;

      case "tipoComprobante":
        av = (a.tipoComprobante?.name ?? "").toLowerCase();
        bv = (b.tipoComprobante?.name ?? "").toLowerCase();
        break;

      case "tipoMovimiento":
        av = (a.tipoMovimiento?.name ?? "").toLowerCase();
        bv = (b.tipoMovimiento?.name ?? "").toLowerCase();
        break;
    }
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return dir === "desc" ? s.reverse() : s;
}
