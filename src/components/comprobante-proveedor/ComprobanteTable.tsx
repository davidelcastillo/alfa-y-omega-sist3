// src/components/comprobante-proveedor/ComprobanteTable.tsx
"use client";

import Button from "@/components/ui/Button";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import type { ComprobanteListItem } from "@/lib/comprobante-proveedor/types";

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
  | "proveedor"   // ojo: acá después aclaramos que es por nombre
  | "deposito"    // idem
  | "tipoComprobante"
  | "tipoMovimiento";
export type SortState = { key: SortKey; dir: "asc" | "desc" };

type Props = {
  comprobantes: ComprobanteListItem [];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSort?: (s: SortState) => void;
  sortState?: SortState;
};

function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function ComprasTable({
  comprobantes,
  onView,
  onEdit,
  onDelete,
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
            {comprobantes.map((comprobante, idx) => (
              <tr key={comprobante.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 font-semibold text-blue-800">{comprobante.id}</td>

                <td className="px-6 py-4 text-gray-700">
                  <div>
                    <div className="font-medium">{comprobante.fecha}</div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 truncate max-w-[18ch]">
                    {comprobante.ordenCompra.id}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 truncate max-w-[18ch]">
                    {comprobante.proveedor.name}
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-700">{comprobante.deposito.name}</td>

                <td className="px-6 py-4 font-semibold text-gray-900">
                  ${money(comprobante.total)}
                </td>

                 <td className="px-6 py-4 font-semibold text-gray-900">
                  ${money(comprobante.saldo)}
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

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.location.href = `/comprobante-proveedor/${comprobante.id}`}
                      title="Ver detalles"
                      aria-label={`Ver detalles de ${comprobante.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(comprobante.id)}
                        title="Eliminar"
                        aria-label={`Eliminar ${comprobante.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {comprobantes.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan={7}>
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
