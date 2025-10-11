// src/components/compras/ComprasDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DetallesCompras from "./ComprasDetalles"; // <— ojo: nombre del archivo
import { apiOCGet } from "@/lib/compras/api";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orderId: string | null;
};

export default function ComprasDetailModal({ open, onOpenChange, orderId }: Props) {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !orderId) return;

    setLoading(true);
    setErr(null);
    setOrder(null);

    const idNum = Number(orderId);
    if (!Number.isFinite(idNum)) {
      setErr(`ID inválido: "${orderId}"`);
      setLoading(false);
      return;
    }

    // Debug rápido
    console.log("[ComprasDetailModal] fetching detalle OC id:", idNum);

apiOCGet(idNum)
  .then((res: any) => {
    console.log("[ComprasDetailModal] respuesta apiOCGet:", res);

    if (!res || !res.data) throw new Error("No se encontró la orden");

    setOrder(res.data);
  })
  .catch((e: any) => {
    console.error("[ComprasDetailModal] error:", e);
    setErr(String(e.message ?? e));
  })
  .finally(() => setLoading(false));

  }, [open, orderId]);

  // Limpiar al cerrar
  useEffect(() => {
    if (!open) {
      setOrder(null);
      setErr(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="!w-[50vw] !max-w-[1400px] !h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-xl">
        {/* Header con fondo rosa */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-300 text-white rounded-t-2xl">
        <AlertDialogTitle className="text-2xl font-bold">
            Detalle de Orden de Compra
        </AlertDialogTitle>
        <button
            onClick={() => onOpenChange(false)}
            className="hover:bg-white/20 p-2 rounded-lg"
            aria-label="Cerrar modal"
        >
            ✕
        </button>
        </div>


        {/* Body */}
        <div className="p-6 ">
          {loading && <p className="text-gray-600">Cargando…</p>}
          {err && <p className="text-red-600 break-all">Error: {err}</p>}
          {!loading && !err && order && <DetallesCompras order={order} />}
          {!loading && !err && !order && (
            <p className="text-gray-600">No se encontró la orden.</p>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
