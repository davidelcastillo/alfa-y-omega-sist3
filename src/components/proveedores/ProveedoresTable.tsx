// components/proveedores/ProveedoresTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { Supplier } from "@/lib/proveedores/types";
import { SquarePen } from 'lucide-react'
import { Trash2 } from 'lucide-react'

type Props = {
  data: Supplier[];
  onEdit: (id: number) => void;
  onToggleStatus: (id: number) => void;
  pageSize?: number;
};

export default function ProveedoresTable({
  data,
  onEdit,
  onToggleStatus,
  pageSize = 10,
}: Props) {
  const [page, setPage] = useState(1);

  const pages = Math.max(1, Math.ceil(data.length / pageSize));

  // Asegura que la página actual sea válida si cambian los datos
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  // >>>>>> AGREGADO
  const totalItems = data.length;
  const totalPages = pages;
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize;
  const end = totalItems === 0 ? 0 : Math.min(start + pageSize, totalItems);
  // <<<<<< AGREGADO

  // Ventana corta de páginas (máx. 5 botones)
  const pageWindow = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(pages, start + windowSize - 1);
    if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, pages]);

  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover">
      <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
        <h3 className="text-xl font-bold text-white">Lista de Proveedores</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Código",
                "Razón Social / Nombre",
                "CUIT/CUIL",
                "Categoría Fiscal",
                "Contacto",
                "Ubicación",
                "Estado",
                "Acciones",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-sm font-bold text-dark-blue whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageData.map((s) => {
              // 🔹 CAMBIO: displayName ahora usa razonSocial o nombre, ya que no tenemos s.nombreCompleto
              const displayName = s.razonSocial || s.nombre || "-";

              // 🔹 CAMBIO: fantasy ahora usa nombreComercial (equivalente a nombreFantasia)
              const fantasy = s.nombreComercial ? ` (${s.nombreComercial})` : "";

              // 🔹 CAMBIO: estado ahora es boolean, lo convertimos a texto para mostrar
              const estadoLabel = s.estado ? "Activo" : "Inactivo";
              const statusClass = s.estado ? "status-active" : "status-inactive";

              return (
                <tr
                  key={s.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{s.codigo || "-"}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {displayName}
                      {fantasy}
                    </div>
                    <div className="text-xs text-gray-500">
                      {/* 🔹 CAMBIO: antes era Empresa / Persona Física según s.tipo
                          ahora mostramos el nombreComercial si existe */}
                      {s.nombreComercial || ""}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {/* 🔹 CAMBIO: antes era s.cuitCuil, ahora el backend devuelve s.cuil */}
                    <div className="text-sm font-semibold text-gray-900">{s.cuil || "-"}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {/* 🔹 CAMBIO: ahora el backend devuelve categoriaFiscalId (número) o categoriaFiscal?.nombre */}
                      {s.categoriaFiscal?.nombre || "-"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {/* 🔹 CAMBIO: antes usaba s.email, ahora es s.correoElectronico */}
                    <div className="text-sm text-gray-700">{s.telefono || "-"}</div>
                    <div className="text-xs text-gray-500">{s.correoElectronico || "Sin email"}</div>
                  </td>

                  <td className="px-6 py-4">
                    {/* 🔹 CAMBIO: combinamos localidad + provincia dinámicamente y mostramos país si existe */}
                    <div className="text-sm text-gray-700">
                      {[s.localidad, s.provincia].filter(Boolean).join(", ")}
                    </div>
                    <div className="text-xs text-gray-500">{s.pais || ""}</div>
                  </td>

                  <td className="px-6 py-4">
                    <Badge className={`text-white font-bold ${statusClass}`}>
                      {estadoLabel}
                    </Badge>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => onEdit(s.id)}
                        title="Editar"
                        aria-label={`Editar ${displayName || s.codigo}`}
                      >
                        <SquarePen className="w-6 h-6" aria-hidden />
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => onToggleStatus(s.id)}
                        // CAMBIO: ahora usamos estadoLabel (Activo/Inactivo) en vez de comparar string ------------
                        title={estadoLabel === "Activo" ? "Desactivar" : "Activar"}
                        aria-label={`${estadoLabel === "Activo" ? "Desactivar" : "Activar"} ${
                          displayName || s.codigo
                        }`}
                        className={
                          estadoLabel === "Activo"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-white-50"
                        }
                      >
                        {estadoLabel === "Activo" ? (
                          <Trash2 className="w-6 h-6" aria-hidden />
                        ) : ( //esto es lo que hizo gaston del icono desactivado
                          <Trash2 className="w-6 h-6 text-gray-400" aria-hidden />
                          
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {pageData.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan={8}>
                  No hay proveedores que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Paginación (REEMPLAZADO) */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-gray-600 font-medium">
          {totalItems === 0 ? (
            <>
              Mostrando <span className="font-bold text-primary-pink">0</span> de{" "}
              <span className="font-bold text-primary-pink">0</span> proveedores
            </>
          ) : (
            <>
              Mostrando{" "}
              <span className="font-bold text-primary-pink">{start + 1}-{end}</span> de{" "}
              <span className="font-bold text-primary-pink">{totalItems}</span> proveedores
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page <= 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-200 hover:bg-gray-50"}`}
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700 px-2">
            Página <span className="font-semibold">{Math.min(page, totalPages)}</span> de{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors
              ${page >= totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-200 hover:bg-gray-50"}`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
