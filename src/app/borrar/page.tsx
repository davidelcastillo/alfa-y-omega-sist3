// src/app/borrar/page.tsx
'use client';

import { useState } from 'react';

type CreateMovimientoBody = {
  depositoId: number;
  tipoMovimientoId: number;
  tipoComprobanteId: number;
  numeroComprobante?: string;
  comentario?: string;
  detalles: Array<{ productoId: number; cantidad: number }>;
};

export default function BorrarPage() {
  // Campos mínimos + opcionales
  const [depositoId, setDepositoId] = useState<number>(1);
  const [tipoMovimientoId, setTipoMovimientoId] = useState<number>(1);
  const [tipoComprobanteId, setTipoComprobanteId] = useState<number>(2); // si usás 2 por defecto
  const [numeroComprobante, setNumeroComprobante] = useState<string>('');
  const [comentario, setComentario] = useState<string>('');

  // Un (1) detalle mínimo para validar el endpoint
  const [productoId, setProductoId] = useState<number>(1);
  const [cantidad, setCantidad] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOut(null);

    try {
      const body: CreateMovimientoBody = {
        depositoId: Number(depositoId),
        tipoMovimientoId: Number(tipoMovimientoId),
        tipoComprobanteId: Number(tipoComprobanteId),
        // opcionales SOLO si tienen valor
        numeroComprobante: numeroComprobante || undefined,
        comentario: comentario || undefined, // ⚠️ minúscula (coincide con Prisma Client)
        detalles: [
          {
            productoId: Number(productoId),
            cantidad: Math.max(1, Number(cantidad) || 1), // al menos 1
          },
        ],
      };

      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || 'Error en el POST');
      }

      setOut(json.data);
    } catch (e: any) {
      setErr(e?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test: Crear movimiento (mínimo)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Depósito ID *</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={depositoId}
              onChange={(e) => setDepositoId(Number(e.target.value))}
              required
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo Movimiento ID *</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={tipoMovimientoId}
              onChange={(e) => setTipoMovimientoId(Number(e.target.value))}
              required
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo Comprobante ID *</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={tipoComprobanteId}
              onChange={(e) => setTipoComprobanteId(Number(e.target.value))}
              required
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">N° Comprobante (opcional)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={numeroComprobante}
              onChange={(e) => setNumeroComprobante(e.target.value)}
              placeholder="Ej: 0001-00001234"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comentario (opcional)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Texto libre"
          />
        </div>

        <fieldset className="border rounded p-3">
          <legend className="text-sm font-semibold">Detalle mínimo</legend>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Producto ID *</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={productoId}
                onChange={(e) => setProductoId(Number(e.target.value))}
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad *</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                min={1}
              />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Enviando…' : 'Crear movimiento'}
        </button>
      </form>

      {err && (
        <p className="mt-4 text-red-600">
          Error: {err}
        </p>
      )}

      {out && (
        <pre className="mt-4 p-3 bg-gray-100 rounded text-sm overflow-auto">
{JSON.stringify(out, null, 2)}
        </pre>
      )}
    </main>
  );
}
