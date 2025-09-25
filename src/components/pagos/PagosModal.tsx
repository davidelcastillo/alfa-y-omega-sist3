// src/components/pagos/PagosModal.tsx
// Modal presentacional — Procesar Pago (UI-only, estilo ComprasModal)
// • Tipo de comprobante: SearchableSelect (⚠️ MOCK opciones)
// • N° de comprobante: SearchableSelect (⚠️ MOCK); el padre resuelve proveedor/total
// • Medio de pago: SearchableSelect (desde DB)
// • Observaciones: textarea
// • Removido: saldo, mora, pagos parciales
// TODO: conectar API real en onConfirm y resolver proveedor/total/forma de pago al seleccionar el comprobante.

"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

type Option = { id: number; nombre: string };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  // Header opcional (referencia de pago)
  paymentIdRef?: string; // ej: "PAG-123"

  // Tipo de comprobante (catálogo)
  voucherTypeOptions: Option[];     // ⚠️ MOCK catálogo
  voucherTypeId: number | 0;
  onChangeVoucherType: (opt: Option | null) => void;

  // N° de comprobante (lista buscable)
  voucherNumberOptions: Option[];   // ⚠️ MOCK: nombre = "00001-00000001 · Proveedor X"
  voucherNumberId: number | 0;      // el padre mapea id → comprobante real
  onChangeVoucherNumber: (opt: Option | null) => void;

  // Medio de pago (DB)
  paymentMethodOptions: Option[];
  paymentMethodId: number | 0;
  onChangePaymentMethod: (opt: Option | null) => void;

  // Observaciones
  observations?: string;
  onChangeObservations?: (v: string) => void;

  // Resueltos por DB (solo lectura)
  resolvedSupplierName?: string;
  resolvedSupplierCode?: string;
  resolvedTotal?: number;

  // Acción final
  onConfirm?: () => void;
};

function money(n: number | undefined) {
  return (n ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 0 });
}

export default function PagosModal({
  open,
  onOpenChange,

  paymentIdRef,

  voucherTypeOptions,
  voucherTypeId,
  onChangeVoucherType,

  voucherNumberOptions,
  voucherNumberId,
  onChangeVoucherNumber,

  paymentMethodOptions,
  paymentMethodId,
  onChangePaymentMethod,

  observations = "",
  onChangeObservations,

  resolvedSupplierName,
  resolvedSupplierCode,
  resolvedTotal,

  onConfirm,
}: Props) {
  const canConfirm =
    Boolean(voucherTypeId) &&
    Boolean(voucherNumberId) &&
    Boolean(paymentMethodId) &&
    Boolean(resolvedSupplierName) &&
    typeof resolvedTotal === "number";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          glass-effect p-0 overflow-hidden
          w-full max-w-3xl md:max-w-4xl
          h-[75vh]
        "
      >
        {/* Header (gradiente como Compras) */}
        <div className="flex-none p-6 rounded-t-2xl bg-gradient-to-r from-primary-pink to-light-pink">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              {paymentIdRef ? `Procesar Pago — ${paymentIdRef}` : "Procesar Pago"}
            </AlertDialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body scrolleable */}
        <div className="flex-auto overflow-y-auto p-8 space-y-8">
          {/* Datos del comprobante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchableSelect
              label="Tipo de comprobante *"
              options={voucherTypeOptions}     // ⚠️ MOCK
              valueId={Number(voucherTypeId || 0)}
              onChange={onChangeVoucherType}
              placeholder="Buscar tipo…"
            />

            <SearchableSelect
              label="N° de comprobante *"
              options={voucherNumberOptions}   // ⚠️ MOCK: nombre = “00001-00000001 · Proveedor…”
              valueId={Number(voucherNumberId || 0)}
              onChange={onChangeVoucherNumber}
              placeholder="Escribí para buscar…"
            />
          </div>

          {/* Panel de información (azul, como tu ejemplo) */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">Información del Pago</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Factura:</span>
                <span className="ml-2 text-gray-900">
                  {voucherNumberId
                    ? voucherNumberOptions.find(o => o.id === voucherNumberId)?.nombre?.split("·")?.[0]?.trim()
                    : "—"}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-600">Proveedor:</span>
                <span className="ml-2 text-gray-900">
                  {resolvedSupplierName || "—"}
                </span>
                {resolvedSupplierCode && (
                  <span className="ml-2 text-xs text-gray-500">{resolvedSupplierCode}</span>
                )}
              </div>

              <div>
                <span className="font-medium text-gray-600">Total de la factura:</span>
                <span className="ml-2 text-gray-900 font-semibold">
                  ${money(resolvedTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Medio de pago + Observaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchableSelect
              label="Medio de pago *"
              options={paymentMethodOptions}   // desde DB
              valueId={Number(paymentMethodId || 0)}
              onChange={onChangePaymentMethod}
              placeholder="Buscar medio…"
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={observations}
                onChange={(e) => onChangeObservations?.(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all"
                placeholder="Notas internas, referencia, etc."
              />
            </div>
          </div>

          {/* Total a pagar (solo lectura, pagos totales) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total a pagar
            </label>
            <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-lg font-semibold text-gray-800">
              ${money(resolvedTotal)}
            </div>
          </div>
        </div>

        {/* Footer (acciones) */}
        <AlertDialogFooter className="px-6 pb-6">
          <div className="flex w-full justify-end gap-4 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="btn-primary"
              onClick={onConfirm}
              disabled={!canConfirm}
              title={!canConfirm ? "Completá tipo, número, medio y que se resuelva proveedor/total" : undefined}
            >
              Confirmar pago
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
