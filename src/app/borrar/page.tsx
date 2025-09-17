// src/app/borrar/page.tsx
'use client';

import { useEffect, useState } from 'react';

type DetalleItem = {
  detalleId: number;
  stockId: number;
  productoId: number;
  producto: string;
  unidad: string | null;
  marca: string | null;
  rubro: string | null;
  cantidad: number;
  signo: 1 | -1;
  stockAntes: number;
  stockDespues: number;
  stockMinimo: number;
  stockMaximo: number | null;
  estado: 'OK' | 'BELOW_MIN' | 'AT_ZERO' | 'OVER_MAX';
};

type DetalleResponse = {
  movimiento: {
    id: number;
    fecha: string;
    hora: string;
    numeroComprobante: string | null;
    comentario?: string | null;
    deposito: { id: number; nombre: string };
    tipoMovimiento: { id: number; nombre: string; saldo: boolean };
    tipoComprobante: { id: number; nombre: string };
  };
  summary: {
    totalLineas: number;
    totalIngreso: number;
    totalEgreso: number;
    neto: number;
  };
  items: DetalleItem[];
};

export default function BorrarDetalleMovimiento() {
  const [data, setData] = useState<DetalleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch('/api/movimientos/12/detalles', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Error al cargar');
      setData(json.data as DetalleResponse);
    } catch (e: any) {
      setErr(e?.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Detalle Movimiento (id=10)</h1>
        <p>Cargando…</p>
      </main>
    );
  }

  if (err) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Detalle Movimiento (id=10)</h1>
        <div className="text-red-600">Error: {err}</div>
        <button
          onClick={load}
          className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
        >
          Reintentar
        </button>
      </main>
    );
  }

  if (!data) return null;

  const { movimiento, summary, items } = data;
  const esIngreso = movimiento.tipoMovimiento.saldo;

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Detalle Movimiento (id={movimiento.id})
        </h1>
        <button
          onClick={load}
          className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
        >
          Refrescar
        </button>
      </div>

      {/* Header */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">Comprobante</h2>
          <div className="text-sm space-y-1">
            <div><span className="text-gray-600">Tipo:</span> {movimiento.tipoComprobante?.nombre ?? '-'}</div>
            <div><span className="text-gray-600">Número:</span> {movimiento.numeroComprobante ?? '-'}</div>
            <div><span className="text-gray-600">Fecha:</span> {new Date(movimiento.fecha).toLocaleDateString()}</div>
            <div><span className="text-gray-600">Hora:</span> {new Date(movimiento.hora).toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">Movimiento</h2>
          <div className="text-sm space-y-1">
            <div><span className="text-gray-600">Depósito:</span> {movimiento.deposito?.nombre}</div>
            <div><span className="text-gray-600">Tipo de Movimiento:</span> {movimiento.tipoMovimiento.nombre}</div>
            <div>
              <span className="text-gray-600">Movimiento:</span>{' '}
              <span className={esIngreso ? 'text-green-700' : 'text-red-700'}>
                {esIngreso ? 'Ingreso' : 'Egreso'}
              </span>
            </div>
            <div><span className="text-gray-600">Comentario:</span> {movimiento.comentario ?? '—'}</div>
          </div>
        </div>
      </section>

      {/* Resumen */}
      <section className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Resumen</h2>
        <div className="text-sm grid grid-cols-2 md:grid-cols-4 gap-2">
          <div><span className="text-gray-600">Líneas:</span> {summary.totalLineas}</div>
          <div><span className="text-gray-600">Total Ingreso:</span> {summary.totalIngreso}</div>
          <div><span className="text-gray-600">Total Egreso:</span> {summary.totalEgreso}</div>
          <div><span className="text-gray-600">Neto:</span> {summary.neto}</div>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Productos</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2">Producto</th>
                <th className="text-left px-3 py-2">Rubro</th>
                <th className="text-left px-3 py-2">Marca</th>
                <th className="text-left px-3 py-2">Unidad</th>
                <th className="text-right px-3 py-2">Cant</th>
                <th className="text-right px-3 py-2">Signo</th>
                <th className="text-right px-3 py-2">Stock Antes</th>
                <th className="text-right px-3 py-2">Stock Después</th>
                <th className="text-center px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.detalleId} className="border-t">
                  <td className="px-3 py-2">{it.producto}</td>
                  <td className="px-3 py-2">{it.rubro ?? '—'}</td>
                  <td className="px-3 py-2">{it.marca ?? '—'}</td>
                  <td className="px-3 py-2">{it.unidad ?? '—'}</td>
                  <td className="px-3 py-2 text-right">{it.cantidad}</td>
                  <td className={`px-3 py-2 text-right ${it.signo === 1 ? 'text-green-700' : 'text-red-700'}`}>
                    {it.signo === 1 ? '+' : '-'}
                  </td>
                  <td className="px-3 py-2 text-right">{it.stockAntes}</td>
                  <td className="px-3 py-2 text-right">{it.stockDespues}</td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={
                        it.estado === 'OK'
                          ? 'text-gray-700'
                          : it.estado === 'AT_ZERO'
                          ? 'text-orange-700'
                          : it.estado === 'BELOW_MIN'
                          ? 'text-red-700'
                          : 'text-indigo-700'
                      }
                    >
                      {it.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                    Sin ítems.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
