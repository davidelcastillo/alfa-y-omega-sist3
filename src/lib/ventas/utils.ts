// src/lib/ventas/utils.ts
import type { FiltersState, Order } from "@/lib/ventas/types";

export const money = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const parseDate = (s?: string) => (s ? new Date(`${s}T00:00:00`) : undefined);

export function filterOrders(list: Order[], filters?: FiltersState): Order[] {
  if (!filters) return list;

  const from = parseDate(filters.from)?.getTime();
  const to   = parseDate(filters.to)?.getTime();

  // ✅ Narrow explícito por literals válidos (sin comparar contra "")
  type StatusOk = Extract<NonNullable<FiltersState["status"]>, "Enviado" | "Pendiente de enviar">;
  const wantedStatus: StatusOk | undefined =
    filters.status === "Enviado" || filters.status === "Pendiente de enviar"
      ? filters.status
      : undefined;

  return list.filter((o) => {
    const od = parseDate(o.orderDate)?.getTime() ?? 0;

    const passFrom   = from ? od >= from : true;
    const passTo     = to   ? od <= to   : true;
    const passNumber = filters.orderNumber
      ? o.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase())
      : true;
    const passStatus = wantedStatus ? o.status === wantedStatus : true;

    return passFrom && passTo && passNumber && passStatus;
  });
}
