// src/components/compras/DetallesCompras.tsx
"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
// Si ya tenés los tipos en tu proyecto, importalos.
// Ajustá el path según tu estructura real:
import type { PurchaseOrder } from "@/lib/compras/purchase";

type Props = { order: PurchaseOrder };

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function DetallesCompras({ order }: Props) {
  const statusClasses =
    order.status === "Completa"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Orden de compra #{order.id}
          </h1>
          <p className="text-gray-600">Detalle de la orden de compra</p>
        </div>

        <Link href="/compras">
          <Button variant="outline" className="rounded-xl">Volver a Compras</Button>
        </Link>
      </div>

      {/* Resumen (total) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white/90 backdrop-blur border border-white/50 shadow-sm text-center md:col-span-1">
          <p className="text-sm font-medium text-blue-600 mb-2">Total de la orden</p>
          <p className="text-3xl font-bold text-blue-800">{money(order.total)}</p>
        </div>
        <div className="hidden md:block rounded-2xl p-6 bg-transparent" />
        <div className="hidden md:block rounded-2xl p-6 bg-transparent" />
      </div>

      {/* Información de la Orden (basado en tu HTML) */}
      <div className="form-section bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="section-header border-b-2 border-gray-100 pb-4 mb-6">
          <h3 className="text-xl font-bold text-blue-800">Información de la Orden de Compra</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">N° Orden</label>
            <p className="text-lg font-bold text-blue-800">{order.id}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha y Hora de Creación</label>
            <p className="text-gray-900">
              {order.creationDate} {order.creationTime ? `- ${order.creationTime}` : ""}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Proveedor</label>
            <p className="text-gray-900">{order.supplier?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Depósito</label>
            <p className="text-gray-900">{order.warehouse}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Entrega</label>
            <p className="text-gray-900">{order.deliveryDate}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Productos (opcional pero útil) */}
      <div className="rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-white/50 shadow-sm">
        <div className="bg-gradient-to-r from-pink-500 to-pink-300 p-4">
          <h3 className="text-white font-bold">Productos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Producto", "Cantidad", "Precio unitario", "Total"].map((h) => (
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
              {order.items?.map((it, idx) => (
                <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">{it.productName}</td>
                  <td className="px-4 py-3">{it.quantity}</td>
                  <td className="px-4 py-3">{money(it.unitPrice)}</td>
                  <td className="px-4 py-3 font-semibold">{money(it.totalPrice)}</td>
                </tr>
              ))}

              {(!order.items || order.items.length === 0) && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                    Sin productos cargados en esta orden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
