// src/lib/comprobante/utils.ts
import type { ComprobanteFiltersState, ComprobanteProveedor, SortState } from "./comprobante";

/*export function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

// Convierte "dd/mm/yyyy" a Date (para comparar)
export function parseDDMMYYYY(dmy: string): Date | null {
  const [d, m, y] = dmy.split("/").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}*/

// Parser robusto: soporta 'dd/mm/yyyy' y formatos ISO ('yyyy-mm-dd' o '2025-10-02T...')
function parseAnyDate(s?: string | null): Date | null {
  if (!s) return null;
  if (s.includes("/")) {
    const [d, m, y] = s.split("/").map(Number);
    if (!d || !m || !y) return null;
    return new Date(y, m - 1, d);
  }
  const d = new Date(s); // ISO u otros parseables por Date
  return isNaN(d.getTime()) ? null : d;
}

// Aplica filtros al arreglo de órdenes
export function applyFilters(data: ComprobanteProveedor[], f: ComprobanteFiltersState): ComprobanteProveedor[] {
  let out = [...data];
  /*if (f.numeroCP) {
    const q = f.numeroCP.toLowerCase();
    out = out.filter((o) => o.id.toLowerCase().includes(q));
  }
  if (f.proveedorId) out = out.filter((o) => o.proveedor.id === f.proveedorId);
  if (f.depositoId) out = out.filter((o) => o.deposito.id === f.depositoId);*/

  if (f.numeroCP) {
    const q = f.numeroCP.toLowerCase();
    out = out.filter((o) =>
      String(o.id).toLowerCase().includes(q) ||
      String(o.numero ?? "").toLowerCase().includes(q) ||
      String(o.numeroSucursal ?? "").toLowerCase().includes(q)
    );
  }

  if (f.proveedorId) out = out.filter((o) => String(o.proveedor?.id) === String(f.proveedorId));
  if (f.depositoId) out = out.filter((o) => String(o.deposito?.id) === String(f.depositoId));


  // Rango de fechas (creationDate dd/mm/yyyy vs filtros yyyy-mm-dd)
  const from = f.fechaDesde ? new Date(f.fechaDesde) : null;
  const to = f.fechaHasta ? new Date(f.fechaHasta) : null;
  /*if (from || to) {
    out = out.filter((o) => {
      const d = new Date(o.fecha);
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
}*/

  if (from || to) {
    out = out.filter((o) => {
      const d = parseAnyDate(o.fecha);
      if (!d) return false;
      if (from && d < from) return false;
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999); // incluir el día 'hasta'
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
  const m = dir === "asc" ? 1 : -1;

  const s = [...data].sort((a, b) => {
    switch (key) {
      case "id": {
        const av = Number(a.id), bv = Number(b.id);
        return (av - bv) * m;
      }
      case "fecha": {
        const av = parseAnyDate(a.fecha)?.getTime() ?? 0;
        const bv = parseAnyDate(b.fecha)?.getTime() ?? 0;
        return (av - bv) * m;
      }
      case "ordenCompra": {
        const av = String(a.ordenCompra?.id ?? "");
        const bv = String(b.ordenCompra?.id ?? "");
        return av.localeCompare(bv) * m;
      }
      case "proveedor": {
        const av = String(a.proveedor?.name ?? "").toLowerCase();
        const bv = String(b.proveedor?.name ?? "").toLowerCase();
        return av.localeCompare(bv) * m;
      }
      case "deposito": {
        const av = String(a.deposito?.name ?? "").toLowerCase();
        const bv = String(b.deposito?.name ?? "").toLowerCase();
        return av.localeCompare(bv) * m;
      }
      case "numero": {
        const av = String(a.numero ?? "");
        const bv = String(b.numero ?? "");
        return av.localeCompare(bv) * m;
      }
      case "numeroSucursal": {
        const av = String(a.numeroSucursal ?? "");
        const bv = String(b.numeroSucursal ?? "");
        return av.localeCompare(bv) * m;
      }
      case "letra": {
        const av = String(a.letra ?? "");
        const bv = String(b.letra ?? "");
        return av.localeCompare(bv) * m;
      }
      case "moneda": {
        const av = String(a.moneda ?? "");
        const bv = String(b.moneda ?? "");
        return av.localeCompare(bv) * m;
      }
      case "total": {
        const av = Number(a.total), bv = Number(b.total);
        return (av - bv) * m;
      }
      case "saldo": {
        const av = Number(a.saldo), bv = Number(b.saldo);
        return (av - bv) * m;
      }
      case "estado": {
        const av = a.estado ? 1 : 0;
        const bv = b.estado ? 1 : 0;
        return (av - bv) * m;
      }
      case "tipoComprobante": {
        const av = String(a.tipoComprobante?.name ?? "").toLowerCase();
        const bv = String(b.tipoComprobante?.name ?? "").toLowerCase();
        return av.localeCompare(bv) * m;
      }
      case "tipoMovimiento": {
        const av = String(a.tipoMovimiento?.name ?? "").toLowerCase();
        const bv = String(b.tipoMovimiento?.name ?? "").toLowerCase();
        return av.localeCompare(bv) * m;
      }
      default:
        return 0;
    }
  });

  return s;
}