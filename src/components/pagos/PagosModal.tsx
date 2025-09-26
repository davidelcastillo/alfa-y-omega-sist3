"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

type Proveedor = {
  id: number;
  nombre: string;
  razonSocial: string | null;
  nombreComercial: string | null;
  comprobantes_pendientes: number;
};

type MetodoPago = {
  id: number;
  nombre: string;
};

type ComprobantePendiente = {
  id: number;
  fecha: string;
  letra: string | null;
  numeroSucursal: string | null;
  numero: string | null;
  total: number | null;
  saldo: number | null;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
};

export default function PagosModal({
  open,
  onOpenChange,
  onSuccess
}: Props) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorId, setProveedorId] = useState<number>(0);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [metodoPagoId, setMetodoPagoId] = useState<number>(0);
  const [comprobantes, setComprobantes] = useState<ComprobantePendiente[]>([]);
  const [selectedComprobantes, setSelectedComprobantes] = useState<{[key: number]: number}>({});
  const [nroInterno, setNroInterno] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [observaciones, setObservaciones] = useState("");

  // Cargar lista de proveedores
  useEffect(() => {
    if (open) {
      fetch("/api/ordenes-pago/proveedores")
        .then(res => res.json())
        .then(json => {
          if (json.ok) setProveedores(json.data);
        });
    }
  }, [open]);

  // Al seleccionar proveedor, cargar sus comprobantes y métodos de pago
  useEffect(() => {
    if (proveedorId > 0) {
      fetch(`/api/ordenes-pago/nueva?proveedorId=${proveedorId}`)
        .then(res => res.json())
        .then(json => {
          if (json.ok) {
            setComprobantes(json.data.comprobantesPendientes);
            setMetodosPago(json.data.metodosPago);
          }
        });
    } else {
      setComprobantes([]);
      setMetodosPago([]);
    }
  }, [proveedorId]);

  const onChangeMontoPagado = (comprobanteId: number, monto: string) => {
    const value = parseFloat(monto);
    if (!isNaN(value) && value > 0) {
      setSelectedComprobantes(prev => ({...prev, [comprobanteId]: value}));
    } else {
      const newSelected = {...selectedComprobantes};
      delete newSelected[comprobanteId];
      setSelectedComprobantes(newSelected);
    }
  };

  const handleSubmit = async () => {
    if (!proveedorId || !metodoPagoId || Object.keys(selectedComprobantes).length === 0) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    const payload = {
      proveedorId,
      fecha,
      metodoPagoId,
      nroInterno: nroInterno || null,
      observaciones: observaciones || null,
      detalles: Object.entries(selectedComprobantes).map(([id, monto]) => ({
        comprobanteId: parseInt(id),
        montoPagado: monto
      }))
    };

    try {
      const res = await fetch("/api/ordenes-pago/nueva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.ok) {
        alert("Orden de pago creada exitosamente");
        onOpenChange(false);
        onSuccess?.();
      } else {
        alert(json.error || "Error al crear la orden de pago");
      }
    } catch (error) {
      alert("Error al procesar la orden de pago");
      console.error(error);
    }
  };

  const canSubmit = proveedorId > 0 && 
                   metodoPagoId > 0 && 
                   Object.keys(selectedComprobantes).length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          glass-effect p-0 overflow-hidden
          w-full max-w-3xl md:max-w-4xl
          h-[75vh]
        "
      >
        {/* Header */}
        <div className="flex-none p-6 rounded-t-2xl bg-gradient-to-r from-primary-pink to-light-pink">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Nueva Orden de Pago
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
          {/* Selección de proveedor y fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchableSelect
              label="Proveedor *"
              options={proveedores.map(p => ({ id: p.id, nombre: p.nombre }))}
              valueId={proveedorId}
              onChange={(opt) => setProveedorId(opt?.id || 0)}
              placeholder="Seleccionar proveedor..."
            />
            <div>
              <label className="block text-sm font-medium mb-2">Fecha *</label>
              <Input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
              />
            </div>
          </div>

          {/* Panel de comprobantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">Comprobantes Pendientes</h4>
            <div className="space-y-4">
              {comprobantes.map(comp => (
                <div key={comp.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">
                      {comp.letra}-{comp.numeroSucursal}-{comp.numero}
                    </p>
                    <p className="text-sm text-gray-600">
                      Saldo: ${comp.saldo?.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Monto a pagar"
                      min={0}
                      max={comp.saldo || 0}
                      onChange={e => onChangeMontoPagado(comp.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {comprobantes.length === 0 && proveedorId > 0 && (
                <p className="text-sm text-gray-500 italic">No hay comprobantes pendientes para este proveedor</p>
              )}
            </div>
          </div>

          {/* Método de pago y N° interno */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchableSelect
              label="Método de pago *"
              options={metodosPago}
              valueId={metodoPagoId}
              onChange={(opt) => setMetodoPagoId(opt?.id || 0)}
              placeholder="Seleccionar método..."
            />
            <div>
              <label className="block text-sm font-medium mb-2">N° Interno</label>
              <Input
                value={nroInterno}
                onChange={e => setNroInterno(e.target.value)}
                placeholder="OP-2025-001"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium mb-2">Observaciones</label>
            <Input
              type="text"
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              placeholder="Ingrese observaciones..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Footer con acciones */}
        <AlertDialogFooter className="px-6 pb-6">
          <div className="flex w-full justify-end gap-4 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              title={!canSubmit ? "Completá proveedor, método de pago y al menos un comprobante" : undefined}
            >
              Crear Orden de Pago
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}