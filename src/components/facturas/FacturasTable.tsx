// src/components/facturas/FacturasTable.tsx
"use client";

import Button from "@/components/ui/Button";
import { Eye, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"; // <-- Truck eliminado
import { moneyAR } from "@/lib/format/money";
import type { Factura } from "@/lib/facturas/types"; // <-- Tipo modificado

// Definimos los tipos de ordenamiento para Facturas
type SortKey =
  | "numeroComprobante"
  | "fecha"
  | "cliente"
  | "tipo"
  | "total"
  | "estadoPago";

export type SortState = { key: SortKey; dir: "asc" | "desc" };

type FacturasTableProps = {
  facturas: Factura[];
  onViewDetail?: (factura: Factura) => void;
  // onDoShipment eliminado
  onSort?: (s: SortState) => void;
  sortState?: SortState;
};

export default function FacturasTable({
  facturas,
  onViewDetail,
  onSort,
  sortState,
}: FacturasTableProps) {
  
  // Función helper para formatear fecha (puedes usar date-fns si prefieres)
  const formatDate = (dateObj: Date) => {
    return dateObj.toLocaleDateString("es-AR", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
        <h3 className="text-xl font-bold text-white">Lista de Facturas</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headerCell("numeroComprobante", "Número")}
              {headerCell("fecha", "Fecha")}
              {headerCell("cliente", "Cliente")}
              {headerCell("tipo", "Tipo")}
              {headerCell("total", "Total")}
              {headerCell("estadoPago", "Estado Pago")}
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-800">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {facturas.map((factura, i) => {
              const estadoPago = (factura.saldo ?? 0) > 0 ? "Pendiente" : "Pagado";
              
              return (
                <tr key={factura.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-semibold text-blue-800">
                    {/* Asumiendo que quieres mostrar sucursal-numero */}
                    {factura.numeroSucursal ?? '0001'}-{factura.numero ?? factura.numeroComprobante}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    <div className="font-medium">{formatDate(factura.fecha)}</div>
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[24ch]">
                    {factura.usuario.nombre} {factura.usuario.apellido}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {factura.tipoComprobante.nombre}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                    {moneyAR(factura.total ?? 0)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        estadoPago === "Pagado"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {estadoPago}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Ver detalle"
                        aria-label={`Ver ${factura.numeroComprobante}`}
                        onClick={() => onViewDetail?.(factura)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {/* --- BOTÓN DE ENVÍO ELIMINADO --- */}

                    </div>
                  </td>
                </tr>
              );
            })}

            {facturas.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  No hay facturas para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}