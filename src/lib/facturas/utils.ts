// src/lib/facturas/utils.ts
import type { FiltersState, Factura } from "@/lib/facturas/types";

// (Puedes mover 'money' a un archivo global 'lib/format/money.ts' como hiciste)
export const money = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// 'parseDate' es útil si la fecha viene como string YYYY-MM-DD
const parseDate = (s?: string) => (s ? new Date(`${s}T00:00:00`) : undefined);

export function filterFacturas(list: Factura[], filters?: FiltersState): Factura[] {
  if (!filters) return list;

  const from = parseDate(filters.from)?.getTime();
  const to   = parseDate(filters.to)?.getTime();

  // Tipo para el estado de pago
  type EstadoPagoOk = Extract<NonNullable<FiltersState["estadoPago"]>, "Pagado" | "Pendiente">;
  const wantedStatus: EstadoPagoOk | undefined =
    filters.estadoPago === "Pagado" || filters.estadoPago === "Pendiente"
      ? filters.estadoPago
      : undefined;

  return list.filter((f) => {
    // f.fecha es un DateTime, pero si pasa por API puede ser string
    const od = new Date(f.fecha).getTime(); 

    const passFrom   = from ? od >= from : true;
    const passTo     = to   ? od <= to   : true;
    
    // Filtro por número de factura (comprobante  o numero )
    const passNumber = filters.numeroComprobante
      ? (f.numero?.includes(filters.numeroComprobante) || 
         f.numeroComprobante?.toString().includes(filters.numeroComprobante))
      : true;

    // Filtro por estado de pago (basado en saldo )
    const passStatus = wantedStatus
      ? (wantedStatus === 'Pagado' ? (f.saldo ?? 0) === 0 : (f.saldo ?? 0) > 0)
      : true;

    return passFrom && passTo && passNumber && passStatus;
  });
}