// src/components/compras/ComprasTable.tsx
"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import type { PurchaseOrder } from "@/lib/compras/purchase";

type SortKey = "id" | "creationDate" | "supplier" | "warehouse" | "total" | "status";
export type SortState = { key: SortKey; dir: "asc" | "desc" };

type Props = {
  orders: PurchaseOrder[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSort?: (s: SortState) => void;
  sortState?: SortState;
};

function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function ComprasTable({
  orders,
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
        <h3 className="text-xl font-bold text-white">Lista de Órdenes de Compra</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headerCell("id", "Número de Orden")}
              {headerCell("creationDate", "Registro")}
              {headerCell("supplier", "Proveedor")}
              {headerCell("warehouse", "Depósito")}
              {headerCell("total", "Total")}
              {headerCell("status", "Estado")}
              <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 font-semibold text-blue-800">{order.id}</td>

                <td className="px-6 py-4 text-gray-700">
                  <div>
                    <div className="font-medium">{order.creationDate}</div>
                    <div className="text-sm text-gray-500">{order.creationTime}</div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 truncate max-w-[18ch]">
                    {order.supplier.name}
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-700">{order.warehouse}</td>

                <td className="px-6 py-4 font-semibold text-gray-900">
                  ${money(order.total)}
                </td>

                <td className="px-6 py-4">
                  <Badge
                    className={
                      order.status === "Completa"
                        ? "status-active text-white"
                        : "status-inactive text-white"
                    }
                  >
                    {order.status}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView?.(order.id)}
                      title="Ver"
                      aria-label={`Ver ${order.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {onEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(order.id)}
                        title="Editar"
                        aria-label={`Editar ${order.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(order.id)}
                        title="Eliminar"
                        aria-label={`Eliminar ${order.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan={7}>
                  No hay órdenes que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
