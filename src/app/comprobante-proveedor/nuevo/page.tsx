"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { apiGetComprobanteInit, apiCreateComprobante } from "@/lib/comprobante-proveedor/api";
import toast from "react-hot-toast";

interface OrdenCompra {
  id: number;
  nro: string | null;
  fecha: string;
  proveedor: {
    id: number;
    nombre: string;
  };
}

interface InitialData {
  ordenesCompra?: Array<OrdenCompra>;
  opciones: {
    tiposComprobante: Array<{ id: number; nombre: string }>;
    metodosPago: Array<{ id: number; nombre: string }>;
  };
  oc?: {
    id: number;
    nro?: string | null;
    fecha: string;
    proveedor: {
      id: number;
      nombre: string;
    };
    deposito: {
      id: number;
      nombre: string;
    } | null;
    items: Array<{
      productoId: number;
      producto: string | null;
      unidad: string | null;
      cantidad: number;
      precioUnitario: number;
    }>;
  };
}

interface ApiResponse {
  ok: boolean;
  data: InitialData;
}

interface ComprobanteFormData {
  ordenCompraId: number;
  proveedorId: number;
  depositoId: number;
  tipoComprobanteId: number;
  fecha: string;
  hora: string;
  letra: string;
  numeroSucursal: string;
  numero: string;
  metodoPagoId: number;
  observaciones: string;
  detalles: Array<{
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    observaciones: string;
  }>;
}

export default function NuevoComprobantePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [formData, setFormData] = useState<ComprobanteFormData>({
    ordenCompraId: 0,
    proveedorId: 0,
    depositoId: 0,
    tipoComprobanteId: 1,
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
    letra: 'A',
    numeroSucursal: '0001',
    numero: '',
    metodoPagoId: 1,
    observaciones: '',
    detalles: []
  });

  const loadOrdenCompra = async (ordenCompraId: number) => {
    try {
      setLoading(true);
      const response = await apiGetComprobanteInit({ ordenCompraId });
      
      // Actualizar el estado manteniendo la lista de OCs actual
      setData(prev => {
        if (!prev) return response;
        return {
          ...prev,
          data: {
            ...prev.data,
            opciones: response.data.opciones,
            oc: response.data.oc
          }
        };
      });
      
      // Si tenemos una OC específica, actualizar el formulario
      if (response.data.oc) {
        setFormData(prev => ({
          ...prev,
          ordenCompraId,
          proveedorId: response.data.oc.proveedor.id,
          depositoId: response.data.oc.deposito?.id || 0,
          detalles: response.data.oc.items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            descuento: 0,
            observaciones: ''
          }))
        }));
      }
    } catch (error) {
      console.error('Error cargando orden de compra:', error);
      toast.error('Error al cargar la orden de compra');
      // Limpiar selección en caso de error
      setFormData(prev => ({
        ...prev,
        ordenCompraId: 0,
        proveedorId: 0,
        depositoId: 0,
        detalles: []
      }));
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales (lista de OCs)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Primera llamada sin ordenCompraId para obtener la lista de OCs
        const initialResponse = await apiGetComprobanteInit();
        if (initialResponse.ok) {
          setData(initialResponse);
        } else {
          throw new Error('Error cargando datos iniciales');
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
        toast.error('Error cargando datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ordenCompraId) {
      toast.error('Debe seleccionar una orden de compra');
      return;
    }

    if (!formData.tipoComprobanteId) {
      toast.error('Debe seleccionar un tipo de comprobante');
      return;
    }

    if (!formData.detalles.length) {
      toast.error('No hay items para procesar');
      return;
    }

    try {
      setLoading(true);
      
      // Transformar datos al formato esperado por la API
      const transformedData = {
        ordenCompra: { id: formData.ordenCompraId },
        proveedor: { id: formData.proveedorId },
        tipoComprobante: { id: formData.tipoComprobanteId },
        deposito: { id: formData.depositoId },
        fecha: formData.fecha,
        hora: formData.hora,
        letra: formData.letra,
        numeroSucursal: formData.numeroSucursal,
        numero: formData.numero,
        metodoPago: { id: formData.metodoPagoId },
        observaciones: formData.observaciones,
        tipoMovimiento: { id: 1 }, // Ingreso por compra
        items: formData.detalles.map(det => ({
          productId: det.productoId,
          quantity: det.cantidad,
          unitPrice: det.precioUnitario,
          discount: det.descuento,
          observations: det.observaciones
        }))
      };

      await apiCreateComprobante(transformedData);
      toast.success('Comprobante creado exitosamente');
      router.push('/comprobante-proveedor');
    } catch (error) {
      console.error('Error creando comprobante:', error);
      toast.error('Error al crear el comprobante');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nuevo Comprobante de Proveedor</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Selección de OC */}
          <Select 
            label="Orden de Compra *"
            value={String(formData.ordenCompraId)}
            onChange={e => {
              const id = Number(e.target.value);
              if (id) {
                loadOrdenCompra(id);
              } else {
                // Limpiar formulario si no se selecciona ninguna OC
                setFormData(prev => ({
                  ...prev,
                  ordenCompraId: 0,
                  proveedorId: 0,
                  depositoId: 0,
                  detalles: []
                }));
              }
            }}
          >
            <option value="">Seleccionar orden de compra</option>
            {data.data.ordenesCompra?.map((oc) => (
              <option key={oc.id} value={String(oc.id)}>
                {oc.nro || 'S/N'} - {oc.proveedor.nombre} ({new Date(oc.fecha).toLocaleDateString()})
              </option>
            ))}
            {!data.data.ordenesCompra?.length && (
              <option value="">No hay órdenes de compra disponibles</option>
            )}
          </Select>

          <Input 
            label="Proveedor"
            value={data.data.oc?.proveedor?.nombre || ''} 
            disabled 
          />

          <Input 
            label="Depósito"
            value={data.data.oc?.deposito?.nombre || ''} 
            disabled 
          />

          {/* Campos editables */}
          <Select 
            label="Tipo de Comprobante *" 
            value={String(formData.tipoComprobanteId)}
            onChange={e => setFormData(prev => ({ ...prev, tipoComprobanteId: Number(e.target.value) }))}
          >
            <option value="">Seleccionar</option>
            {data.data.opciones.tiposComprobante.map((tipo) => (
              <option key={tipo.id} value={String(tipo.id)}>
                {tipo.nombre}
              </option>
            ))}
          </Select>

          <Input 
            label="Fecha *"
            type="date"
            value={formData.fecha}
            onChange={e => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
          />

          <Input 
            label="Hora"
            type="time"
            value={formData.hora}
            onChange={e => setFormData(prev => ({ ...prev, hora: e.target.value }))}
          />

          <Input 
            label="Letra"
            value={formData.letra}
            onChange={e => setFormData(prev => ({ ...prev, letra: e.target.value }))}
            maxLength={1}
          />

          <Input 
            label="Sucursal"
            value={formData.numeroSucursal}
            onChange={e => setFormData(prev => ({ ...prev, numeroSucursal: e.target.value }))}
            maxLength={4}
          />

          <Input 
            label="Número"
            value={formData.numero}
            onChange={e => setFormData(prev => ({ ...prev, numero: e.target.value }))}
            maxLength={8}
          />

          <Select 
            label="Método de Pago *"
            value={String(formData.metodoPagoId)}
            onChange={e => setFormData(prev => ({ ...prev, metodoPagoId: Number(e.target.value) }))}
          >
            <option value="">Seleccionar</option>
            {data.data.opciones.metodosPago.map((metodo) => (
              <option key={metodo.id} value={String(metodo.id)}>
                {metodo.nombre}
              </option>
            ))}
          </Select>
        </div>

        {/* Observaciones */}
        <Input
          label="Observaciones"
          value={formData.observaciones}
          onChange={e => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
          placeholder="Observaciones generales del comprobante..."
        />

        {/* Tabla de Detalles */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Detalle de Items</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Producto</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Precio Unit.</th>
                <th className="p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {formData.detalles.map((detalle, idx) => {
                const item = data.data.oc?.items.find((i) => i.productoId === detalle.productoId);
                const subtotal = detalle.cantidad * detalle.precioUnitario;
                
                return (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{item?.producto ?? 'N/A'}</td>
                    <td className="p-2">
                      <Input 
                        type="number"
                        value={detalle.cantidad}
                        onChange={e => {
                          const detalles = [...formData.detalles];
                          detalles[idx].cantidad = Number(e.target.value);
                          setFormData(prev => ({ ...prev, detalles }));
                        }}
                      />
                    </td>
                    <td className="p-2">${detalle.precioUnitario.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                    <td className="p-2">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan={3} className="text-right p-2">Total:</td>
                <td className="p-2">
                  ${formData.detalles.reduce((acc, det) => 
                    acc + (det.cantidad * det.precioUnitario), 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Comprobante'}
          </Button>
        </div>
      </form>
    </div>
  );
}
