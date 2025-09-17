"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import MovimientosDetailModal from "@/components/movimientos/MovimientosDetailModal";
import type { Movimiento } from "@/lib/movimientos/productsData";

async function fetchMovimientoDetalle(id: number) {
  const res = await fetch(`/api/movimientos/${id}/detalles`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar el detalle");
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Error de API");
  return json.data;
}

function mapTipoMovimiento(apiTipo: string): Movimiento["tipoMovimiento"] {
  switch (apiTipo) {
    case "Transferencia entre depósitos":
      return "Transferencia entre depósitos";
    case "Compra de inventario":
      return "Compra de inventario";
    case "Venta de inventario":
      return "Venta de inventario";
    case "Ajuste de stock":
      return "Ajuste de stock";
    default:
      return "Ajuste de stock";
  }
}

export default function PruebasPage() {
  const [testId, setTestId] = useState(1);
  const [selected, setSelected] = useState<Movimiento | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleTestView = async () => {
    try {
      const det = await fetchMovimientoDetalle(testId);

      const movimientoDet: Movimiento = {
        id: det.movimiento.id,
        fechaISO: det.movimiento.fecha.slice(0, 10),
        movimiento: det.movimiento.tipoMovimiento.saldo ? "Ingreso" : "Egreso",
        tipoMovimiento: mapTipoMovimiento(det.movimiento.tipoMovimiento.nombre),
        comprobanteId: det.movimiento.numeroComprobante ?? undefined,
        comentario: det.movimiento.comentario ?? undefined,
        deposito: {
          id: det.movimiento.deposito.id,
          nombre: det.movimiento.deposito.nombre,
        },
        productos: det.items.map((it: any) => ({
          producto: { id: it.productoId, codigo: "", descripcion: it.producto },
          cantidad: it.signo === -1 ? -it.cantidad : it.cantidad, // 👈 negativo si es egreso
        })),
      };

      setSelected(movimientoDet);
      setDetailOpen(true);
    } catch (e: any) {
      alert(e.message || "Error cargando detalle");
    }
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary-pink">Pruebas de Movimientos</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
          <span className="text-gray-700">ID actual:</span>
          <span className="font-bold">{testId}</span>
          <Button
            variant="outline"
            onClick={() => setTestId((id) => id + 1)}
            className="px-3 py-1"
          >
            ➕
          </Button>
          <Button
            variant="outline"
            onClick={() => setTestId((id) => Math.max(1, id - 1))}
            className="px-3 py-1"
          >
            ➖
          </Button>
        </div>

        <Button variant="primary" onClick={handleTestView}>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Ver ID {testId}
        </Button>
      </div>

      <MovimientosDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        movimiento={selected}
      />
    </main>
  );
}
