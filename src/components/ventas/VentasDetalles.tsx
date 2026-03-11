// src/components/ventas/VentasDetalles.tsx
"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { moneyAR } from "@/lib/format/money";
import type { VentaDetail } from "@/lib/ventas/types";
type Props = { venta: VentaDetail };

export default function VentasDetalles({ venta }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Pedido {venta.orderNumber}
          </h1>
          <p className="text-gray-600">Detalle del pedido de venta</p>
        </div>

        <Link href="/ventas">
          <Button variant="outline" className="rounded-xl">Volver a Ventas</Button>
        </Link>
      </div>

      {/* Resumen (Total) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center md:col-span-1">
          <p className="text-sm font-medium text-blue-600 mb-2">Total del pedido</p>
          <p className="text-3xl font-bold text-blue-800">{moneyAR(venta.total)}</p>
        </div>
        <div className="hidden md:block rounded-2xl p-6 bg-transparent" />
        <div className="hidden md:block rounded-2xl p-6 bg-transparent" />
      </div>

      {/* Información del pedido */}
      <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Información del pedido</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Fecha de pedido</span>
              <p className="text-lg font-semibold text-gray-900">
                {venta.orderDate} <span className="text-sm text-gray-500">{venta.orderTime}</span>
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Cliente</span>
              <p className="text-lg font-semibold text-gray-900">{venta.customerName}</p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Tarjeta</span>
              <p className="text-lg font-semibold text-gray-900">{venta.cardNumber}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Estado</span>
              <p className="text-lg font-semibold text-gray-900">{venta.status}</p>
              {venta.status === "Enviado" && venta.shippedDate && (
                <p className="text-sm text-gray-500">Enviado el {venta.shippedDate}</p>
              )}
            </div>

            <div>
              <span className="text-sm text-gray-600">Depósito</span>
              <p className="text-lg font-semibold text-gray-900">{venta.warehouse ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* Comentario opcional o info extra: registrationDate */}
        <p className="mt-4 text-gray-700">
          <span className="font-medium">Fecha de registro:</span>{" "}
          {venta.registrationDate}
        </p>
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
              {venta.products.map((it, idx) => (
                <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">{it.name}</td>
                  <td className="px-4 py-3">{it.quantity}</td>
                  <td className="px-4 py-3">{moneyAR(it.unitPrice)}</td>
                  <td className="px-4 py-3 font-semibold">{moneyAR(it.subtotal)}</td>
                </tr>
              ))}
              {venta.products.length === 0 && (
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

      {/* Historial (opcional, muestra si hay) */}
      {venta.history?.length > 0 && (
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Historial</h3>
          <ul className="space-y-2">
            {venta.history.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-sm text-gray-500 min-w-[140px]">{h.date}</span>
                <span className="text-gray-800">{h.action}</span>
                <span className="text-gray-500 text-sm">— {h.user}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
