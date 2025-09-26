"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";

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

export default function NuevoPagoPage() {
  const router = useRouter();
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
    fetch("/api/ordenes-pago/proveedores")
      .then(res => res.json())
      .then(json => {
        if (json.ok) setProveedores(json.data);
      });
  }, []);

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

  const onSubmit = async () => {
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

    const res = await fetch("/api/ordenes-pago/nueva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.ok) {
      alert("Orden de pago creada exitosamente");
      router.push("/pagos"); // Redirigir al listado
    } else {
      alert(json.error || "Error al crear la orden de pago");
    }
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent
        className="
          glass-effect p-0 overflow-hidden
          w-full max-w-3xl md:max-w-4xl
          h-[75vh]
        "
      >
        {/* Header con gradiente */}
        <div className="flex-none p-6 rounded-t-2xl bg-gradient-to-r from-primary-pink to-light-pink">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Nueva Orden de Pago
            </AlertDialogTitle>
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

          {/* Panel informativo */}
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
              onChange={(e) => setObservaciones(e.target.value)}
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
              onClick={() => router.push("/pagos")}
            >
              Cancelar
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!proveedorId || !metodoPagoId || Object.keys(selectedComprobantes).length === 0}
            >
              Crear Orden de Pago
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}