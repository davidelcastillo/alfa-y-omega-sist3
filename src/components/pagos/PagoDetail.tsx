// src/components/pagos/PagoDetail.tsx
// Componente presentacional (solo UI)
// • Removido: estado, pago/saldo, vencimiento, comprobante, pagos parciales e historial
// • Botón fijo para volver a /pagos
// TODO: conectar API — recibir "pago" real desde el server/page (hoy MOCK).

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import type { SupplierPayment } from "@/mocks/pagos.mock";

type Props = { pago: SupplierPayment };

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function PagoDetail({ pago }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Pago {pago.paymentId}
          </h1>
          <p className="text-gray-600">Detalle del pago al proveedor</p>
        </div>

        <Link href="/pagos">
          <Button variant="outline" className="rounded-xl">Volver a Pagos</Button>
        </Link>
      </div>

      {/* Resumen (solo total) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center md:col-span-1">
          <p className="text-sm font-medium text-blue-600 mb-2">Total de la factura</p>
          <p className="text-3xl font-bold text-blue-800">{money(pago.total)}</p>
        </div>
        <div className="hidden md:block rounded-2xl p-6 bg-transparent" />
        <div className="hidden md:block rounded-2xl p-6 bg-transparent" />
      </div>

      {/* Información principal (sin vencimiento ni comprobante) */}
      <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Información del pago</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Código de factura</span>
              <p className="text-lg font-semibold text-gray-900">{pago.invoiceCode}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Orden de compra</span>
              <p className="text-lg font-semibold text-gray-900">{pago.purchaseOrderNumber}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Proveedor</span>
              <p className="text-lg font-semibold text-gray-900">{pago.supplier.name}</p>
              <p className="text-sm text-gray-500">{pago.supplier.code}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Forma de pago</span>
              <p className="text-lg font-semibold text-gray-900">{pago.paymentMethod ?? "-"}</p>
            </div>
          </div>
        </div>

        {pago.comment && (
          <p className="mt-4 text-gray-700">
            <span className="font-medium">Comentario:</span> {pago.comment}
          </p>
        )}
      </div>

      {/* Productos */}
      <div className="rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-white/50 shadow-sm">
        <div className="bg-gradient-to-r from-pink-500 to-pink-300 p-4">
          <h3 className="text-white font-bold">Productos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Producto", "Cantidad", "Precio unitario", "Subtotal"].map((h) => (
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
              {pago.products.map((it, idx) => (
                <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">{it.name}</td>
                  <td className="px-4 py-3">{it.quantity}</td>
                  <td className="px-4 py-3">{money(it.unitPrice)}</td>
                  <td className="px-4 py-3 font-semibold">{money(it.subtotal)}</td>
                </tr>
              ))}
              {pago.products.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                    Sin productos asociados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Secciones removidas: estado, pagos/saldo, vencimiento, comprobante, pagos parciales e historial */}
    </div>
  );
}
