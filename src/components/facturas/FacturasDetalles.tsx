// src/components/facturas/FacturasDetalles.tsx
"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { moneyAR } from "@/lib/format/money";
import type { FacturaDetail } from "@/lib/facturas/types"; // <-- Tipo modificado

type Props = { factura: FacturaDetail };

export default function FacturasDetalles({ factura }: Props) {
  
  const estadoPago = (factura.saldo ?? 0) > 0 ? "Pendiente" : "Pagado";
  
  const formatDate = (dateObj: Date) => {
    return dateObj.toLocaleString("es-AR", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Factura {factura.numeroSucursal ?? '0001'}-{factura.numero}
          </h1>
          <p className="text-gray-600">Detalle del comprobante de cliente</p>
        </div>

        <Link href="/facturas">
          <Button variant="outline" className="rounded-xl">Volver a Facturas</Button>
        </Link>
      </div>

      {/* Resumen (Total y Saldo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center">
          <p className="text-sm font-medium text-blue-600 mb-2">Total de la factura</p>
          <p className="text-3xl font-bold text-blue-800">{moneyAR(factura.total ?? 0)}</p>
        </div>
        <div className={`rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center ${
          estadoPago === 'Pendiente' ? 'bg-yellow-50' : 'bg-green-50'
        }`}>
          <p className={`text-sm font-medium ${
            estadoPago === 'Pendiente' ? 'text-yellow-700' : 'text-green-700'
          } mb-2`}>Saldo Pendiente</p>
          <p className={`text-3xl font-bold ${
            estadoPago === 'Pendiente' ? 'text-yellow-800' : 'text-green-800'
          }`}>{moneyAR(factura.saldo ?? 0)}</p>
        </div>
        <div className="hidden md:block rounded-2xl p-6 bg-transparent" />
      </div>

      {/* Información de la factura */}
      <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Información de la factura</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Fecha de factura</span>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(factura.fecha)}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Cliente</span>
              <p className="text-lg font-semibold text-gray-900">
                {factura.usuario.nombre} {factura.usuario.apellido}
              </p>
              <p className="text-sm text-gray-500">{factura.usuario.email}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Método de Pago</span>
              <p className="text-lg font-semibold text-gray-900">
                {factura.metodoPago?.nombre ?? "No especificado"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Estado de Pago</span>
              <p className={`text-lg font-semibold ${
                estadoPago === 'Pendiente' ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {estadoPago}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Depósito</span>
              <p className="text-lg font-semibold text-gray-900">
                {factura.Deposito?.nombre ?? "-"}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Dirección de Facturación</span>
              <p className="text-lg font-semibold text-gray-900">
                {factura.direccion.calle} {factura.direccion.numero}, {factura.direccion.ciudad}
              </p>
            </div>
          </div>
        </div>

        {factura.observaciones && (
          <p className="mt-4 text-gray-700">
            <span className="font-medium">Observaciones:</span>{" "}
            {factura.observaciones}
          </p>
        )}
      </div>

      {/* Productos */}
      <div className="rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-white/50 shadow-sm">
        <div className="bg-gradient-to-r from-pink-500 to-pink-300 p-4">
          <h3 className="text-white font-bold">Detalle de la Factura</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Producto", "SKU", "Cantidad", "Precio unitario", "Subtotal"].map((h) => (
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
              {factura.detalleComprobante.map((it, idx) => (
                <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">{it.producto.nombre}</td>
                  <td className="px-4 py-3">{it.producto.sku ?? '-'}</td>
                  <td className="px-4 py-3">{it.cantidad}</td>
                  <td className="px-4 py-3">{moneyAR(it.precioUnitario)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {/* El schema tiene precioXCantidad, úsalo si existe, si no, calcúlalo */}
                    {moneyAR(it.precioXCantidad ?? (it.cantidad * it.precioUnitario))}
                  </td>
                </tr>
              ))}
              {factura.detalleComprobante.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                    Sin productos asociados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Historial (eliminado) */}
      
    </div>
  );
}