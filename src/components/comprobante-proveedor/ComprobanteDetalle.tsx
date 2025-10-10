// src/components/comprobante-proveedor/ComprobanteDetalleClient.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface DetalleComprobante {
  id: number;
  fecha: string;
  hora: string;
  nro_comprobante: string | null;
  proveedor: { id: number; nombre: string };
  tipo_comprobante: string;
  orden_compra: { id: number; nro: string | null };
  deposito: { id: number; nombre: string } | null;
  estado: boolean;
  observaciones: string | null;
  totales: {
    items: number;
    total_db: number;
    total_calc: number;
    saldo_db: number;
    pagado_calc: number;
  };
  items: {
    productoId: number;
    producto: string;
    rubro: string;
    marca: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
    descuento: number | null;
    totalLinea: number;
    observaciones: string | null;
  }[];
}

type Props = { id: string };

export default function ComprobanteDetalleClient({ id }: Props) {
  const [comprobante, setComprobante] = useState<DetalleComprobante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchComprobante = async () => {
      try {
        const res = await fetch(`/api/comprobantes-proveedor/${id}/detalle`);
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Error al cargar el comprobante");
        setComprobante(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchComprobante();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  if (error) return <div className="max-w-6xl mx-auto p-6 text-red-500">Error: {error}</div>;
  if (!comprobante) return <div className="max-w-6xl mx-auto p-6">No se encontró el comprobante</div>;

  const money = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Comprobante {comprobante.nro_comprobante || `#${comprobante.id}`}
          </h1>
          <p className="text-gray-600">Detalle del comprobante de proveedor</p>
        </div>

        <Button variant="outline" className="rounded-xl" onClick={() => router.back()}>
          Volver
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center">
          <p className="text-sm font-medium text-blue-600 mb-2">Total</p>
          <p className="text-3xl font-bold text-blue-800">{money(comprobante.totales.total_db)}</p>
        </div>
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center">
          <p className="text-sm font-medium text-blue-600 mb-2">Saldo</p>
          <p className="text-3xl font-bold text-blue-800">{money(comprobante.totales.saldo_db)}</p>
        </div>
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center">
          <p className="text-sm font-medium text-blue-600 mb-2">Pagado</p>
          <p className="text-3xl font-bold text-blue-800">{money(comprobante.totales.pagado_calc)}</p>
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info general */}
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Información general</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Fecha</span>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(comprobante.fecha).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hora</span>
              <p className="text-lg font-semibold text-gray-900">{comprobante.hora}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Tipo</span>
              <p className="text-lg font-semibold text-gray-900">{comprobante.tipo_comprobante}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Estado</span>
              <p className={`text-lg font-semibold ${comprobante.estado ? "text-green-600" : "text-red-600"}`}>
                {comprobante.estado ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>
        </div>

        {/* Proveedor / Depósito */}
        <div className="space-y-6">
          <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Proveedor</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">ID</span>
                <p className="text-lg font-semibold text-gray-900">{comprobante.proveedor.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Nombre</span>
                <p className="text-lg font-semibold text-gray-900">{comprobante.proveedor.nombre}</p>
              </div>
            </div>
          </div>

          {comprobante.deposito && (
            <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Depósito</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">ID</span>
                  <p className="text-lg font-semibold text-gray-900">{comprobante.deposito.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Nombre</span>
                  <p className="text-lg font-semibold text-gray-900">{comprobante.deposito.nombre}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de items */}
      <div className="rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-white/50 shadow-sm">
        <div className="bg-gradient-to-r from-pink-500 to-pink-300 p-4">
          <h3 className="text-white font-bold">Productos ({comprobante.totales.items})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Producto",
                  "Rubro",
                  "Marca",
                  "Unidad",
                  "Cantidad",
                  "Precio unitario",
                  "Descuento",
                  "Total",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comprobante.items.map((it, idx) => (
                <tr key={it.productoId} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-sm text-gray-900">{it.producto}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{it.rubro}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{it.marca}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{it.unidad}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{it.cantidad}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{money(it.precioUnitario)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {it.descuento ? `${it.descuento}%` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                    {money(it.totalLinea)}
                  </td>
                </tr>
              ))}
              {comprobante.items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                    Sin productos asociados.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={7} className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Total:
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-800">
                  {money(comprobante.totales.total_db)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Observaciones */}
      {comprobante.observaciones && (
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Observaciones</h3>
          <p className="text-gray-700">{comprobante.observaciones}</p>
        </div>
      )}
    </div>
  );
}