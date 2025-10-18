// src/components/pagos/PagosTable.tsx
"use client";

import Button from "@/components/ui/Button";
import { Eye, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { SupplierPayment } from "@/mocks/pagos.mock";
import { moneyAR } from "@/lib/format/money";


type SortKey = "paymentId" | "supplier" | "total" | "voucherNumber" | "paymentMethod";
export type SortState = { key: SortKey; dir: "asc" | "desc" };

type Props = {
  data: SupplierPayment[];
  onView?: (id: string) => void;
  onSort?: (s: SortState) => void;
  sortState?: SortState;
};

function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function PagosTable({ data, onView, onSort, sortState }: Props) {
  function headerCell(k: SortKey, label: string) {
    const active = sortState?.key === k;
    const dir = sortState?.dir ?? "asc";
    const nextDir: "asc" | "desc" = active && dir === "asc" ? "desc" : "asc";

    const Icon = !active ? ChevronsUpDown : dir === "asc" ? ChevronUp : ChevronDown;
    const ariaSort = active ? (dir === "asc" ? "ascending" : "descending") : "none";

    return (
      <th
        scope="col"
        aria-sort={ariaSort}
        className="px-6 py-4 text-left text-sm font-bold text-blue-800"
      >
        <button
          type="button"
          onClick={() => onSort?.({ key: k, dir: nextDir })}
          className="inline-flex items-center gap-1 select-none hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-pink)] rounded"
        >
          <span>{label}</span>
          <Icon className="w-4 h-4" aria-hidden />
        </button>
      </th>
    );
  }

  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover border">
      <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
        <h3 className="text-xl font-bold text-white">Lista de Pagos</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headerCell("paymentId", "Id de pago")}
              {headerCell("supplier", "Proveedor")}
              {headerCell("total", "Total")}
              {headerCell("voucherNumber", "N° Factura")}
              {headerCell("paymentMethod", "Forma de Pago")}
              <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, idx) => (
              <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {/* Id de pago */}
                <td className="px-6 py-4 font-semibold text-blue-800">{p.paymentId}</td>

                {/* Proveedor */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 truncate max-w-[28ch]">
                    {p.supplier.name}
                  </div>
                  <div className="text-xs text-gray-500">{p.supplier.code}</div>
                </td>

                {/* Total */}
                <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                  {moneyAR(p.total)}
                </td>

                {/* N° Factura */}
                <td className="px-6 py-4 text-gray-700">{p.voucherNumber ?? "-"}</td>

                {/* Forma de Pago */}
                <td className="px-6 py-4 text-gray-700">{p.paymentMethod ?? "-"}</td>

                {/* Acciones */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView?.(p.id)}
                      title="Ver"
                      aria-label={`Ver ${p.paymentId}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan={6}>
                  No hay pagos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
