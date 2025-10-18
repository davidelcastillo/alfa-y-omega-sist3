// src/components/comprobante-proveedor/ComprobanteTable.tsx
"use client";

import Button from "@/components/ui/Button";
import {
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import type { ComprobanteListItem } from "@/lib/comprobante-proveedor/types";
import { moneyAR } from "@/lib/format/money";

type SortKey =
  | "id"
  | "ordenCompra"
  | "fecha"
  | "hora"
  | "numero"
  | "numeroSucursal"
  | "letra"
  | "moneda"
  | "total"
  | "saldo"
  | "estado"
  | "proveedor"
  | "deposito"
  | "tipoComprobante"
  | "tipoMovimiento";
export type SortState = { key: SortKey; dir: "asc" | "desc" };

type Props = {
  comprobantes: ComprobanteListItem[];
  onView?: (id: number) => void;
  //onEdit?: (id: number) => void;
  //onDelete?: (id: number) => void;
  onSort?: (s: SortState) => void;
  sortState?: SortState;
};

export default function ComprasTable({
  comprobantes,
  onView,
  onSort,
  sortState,
}: Props) {
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
        <h3 className="text-xl font-bold text-white">Lista de Comprobantes de Proveedor</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headerCell("id", "Número de Comprobante")}
              {headerCell("fecha", "Registro")}
              {headerCell("ordenCompra", "Número de Orden Compra")}
              {headerCell("proveedor", "Proveedor")}
              {headerCell("deposito", "Depósito")}
              {headerCell("total", "Total")}
              {headerCell("saldo", "Saldo")}
              <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {comprobantes.map((comprobante, idx) => {
              const ocId = comprobante.ordenCompra?.id ?? "-";
              const proveedorNombre = comprobante.proveedor?.name ?? "-";
              const depositoNombre = comprobante.deposito?.name ?? "-";

              return (
                <tr key={comprobante.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-semibold text-blue-800 text-center">{comprobante.id}</td>

                  <td className="px-6 py-4 text-gray-700">
                    <div>
                      <div className="font-medium">{comprobante.fecha}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 truncate max-w-[18ch] text-center">
                      {ocId}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 truncate max-w-[18ch]">
                      {proveedorNombre}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-700">{depositoNombre}</td>

                  <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                    {moneyAR(comprobante.total)}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                    {moneyAR(comprobante.saldo)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView?.(comprobante.id)}
                        title="Ver"
                        aria-label={`Ver ${comprobante.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {comprobantes.length === 0 && (
              <tr>
                {/* 8 columnas (7 + Acciones) */}
                <td className="px-6 py-10 text-center text-gray-500" colSpan={8}>
                  No hay comprobantes que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}