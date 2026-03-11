"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { apiGetComprobanteInit } from "@/lib/comprobante-proveedor/api";
import toast from "react-hot-toast";

interface OrdenCompra {
  id: number;
  nro: string | null;
  fecha: string;
  proveedor: { id: number; nombre: string };
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
    proveedor: { id: number; nombre: string };
    deposito: { id: number; nombre: string } | null;
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
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().split(" ")[0].substring(0, 5),
    letra: "A",
    numeroSucursal: "0001",
    numero: "",
    metodoPagoId: 1,
    observaciones: "",
    detalles: [],
  });

  const loadOrdenCompra = async (ordenCompraId: number) => {
    try {
      setLoading(true);
      const response = await apiGetComprobanteInit({ ordenCompraId });

      // cache de opciones/oc
      setData((prev) => {
        if (!prev) return response;
        return {
          ...prev,
          data: {
            ...prev.data,
            opciones: response.data.opciones,
            oc: response.data.oc,
          },
        };
      });

      const oc = response.data.oc;
      if (!oc) {
        setFormData((prev) => ({
          ...prev,
          ordenCompraId: 0,
          proveedorId: 0,
          depositoId: 0,
          detalles: [],
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        ordenCompraId,
        proveedorId: oc.proveedor.id,
        depositoId: oc.deposito?.id ?? 0,
        detalles: oc.items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          descuento: 0,
          observaciones: "",
        })),
      }));
    } catch (error) {
      console.error("Error cargando orden de compra:", error);
      toast.error("Error al cargar la orden de compra");
      setFormData((prev) => ({
        ...prev,
        ordenCompraId: 0,
        proveedorId: 0,
        depositoId: 0,
        detalles: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  // datos iniciales (lista de OCs)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const initialResponse = await apiGetComprobanteInit();
        if (initialResponse.ok) {
          setData(initialResponse);
        } else {
          throw new Error("Error cargando datos iniciales");
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error cargando datos iniciales");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ordenCompraId) {
      toast.error("Debe seleccionar una orden de compra");
      return;
    }
    if (!formData.tipoComprobanteId) {
      toast.error("Debe seleccionar un tipo de comprobante");
      return;
    }
    if (!formData.detalles.length) {
      toast.error("No hay items para procesar");
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        ordenCompraId: formData.ordenCompraId,
        proveedorId: formData.proveedorId,
        tipoComprobanteId: formData.tipoComprobanteId,
        fecha: formData.fecha,
        letra: formData.letra,
        numeroSucursal: formData.numeroSucursal,
        numero: formData.numero,
        metodoPagoId: formData.metodoPagoId,
        observaciones: formData.observaciones || null,
        detalles: formData.detalles.map((det) => ({
          productoId: det.productoId,
          cantidad: det.cantidad,
          precioUnitario: det.precioUnitario,
          ...(det.descuento ? { descuento: det.descuento } : {}),
          ...(det.observaciones ? { observaciones: det.observaciones } : {}),
        })),
      };
      if (formData.depositoId && formData.depositoId > 0) {
        payload.depositoId = formData.depositoId;
      }

      const res = await fetch("/api/comprobantes-proveedor/nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        toast.success("Comprobante creado exitosamente");
        router.push("/comprobante-proveedor");
      } else {
        throw new Error(json?.error || "Error al crear el comprobante");
      }
    } catch (error: any) {
      console.error("Error creando comprobante:", error);
      toast.error(error?.message || "Error al crear el comprobante");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const totalComprobante = formData.detalles.reduce(
    (acc, det) => acc + det.cantidad * det.precioUnitario,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Título */}
      <div className="bg-gradient-to-r from-primary-pink to-light-pink rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Nuevo Comprobante de Proveedor
        </h1>
        <p className="text-white/90 mt-1">
          Completa los datos y revisa los ítems antes de registrar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información del comprobante */}
        <section className="form-section bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="section-header border-b-2 border-gray-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-blue-800">
              Información del Comprobante
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Orden de compra */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Orden de Compra *
              </label>
              <Select
                value={String(formData.ordenCompraId)}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  if (id) {
                    loadOrdenCompra(id);
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      ordenCompraId: 0,
                      proveedorId: 0,
                      depositoId: 0,
                      detalles: [],
                    }));
                  }
                }}
              >
                <option value="">Seleccionar orden de compra</option>
                {data.data.ordenesCompra?.map((oc) => (
                  <option key={oc.id} value={String(oc.id)}>
                    {oc.nro || "S/N"} - {oc.proveedor.nombre} (
                    {new Date(oc.fecha).toLocaleDateString()})
                  </option>
                ))}
                {!data.data.ordenesCompra?.length && (
                  <option value="">No hay órdenes de compra disponibles</option>
                )}
              </Select>
            </div>

            {/* Proveedor (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Proveedor
              </label>
              <Input
                value={data.data.oc?.proveedor?.nombre || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Depósito (read-only, viene de la OC) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Depósito
              </label>
              <Input
                value={data.data.oc?.deposito?.nombre || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha *
              </label>
              <Input
                type="date"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fecha: e.target.value }))
                }
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora
              </label>
              <Input
                type="time"
                value={formData.hora}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hora: e.target.value }))
                }
              />
            </div>
          </div>
        </section>

        {/* Tipo y numeración */}
        <section className="form-section bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="section-header border-b-2 border-gray-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-blue-800">Tipo y Numeración</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Tipo de comprobante */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Comprobante *
              </label>
              <Select
                value={String(formData.tipoComprobanteId)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipoComprobanteId: Number(e.target.value),
                  }))
                }
              >
                <option value="">Seleccionar</option>
                {data.data.opciones.tiposComprobante.map((tipo) => (
                  <option key={tipo.id} value={String(tipo.id)}>
                    {tipo.nombre}
                  </option>
                ))}
              </Select>
            </div>

            {/* Letra */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Letra
              </label>
              <Input
                value={formData.letra}
                maxLength={1}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, letra: e.target.value }))
                }
              />
            </div>

            {/* Sucursal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sucursal (4 díg.)
              </label>
              <Input
                value={formData.numeroSucursal}
                maxLength={4}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    numeroSucursal: e.target.value,
                  }))
                }
              />
            </div>

            {/* Número */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número (8 díg.)
              </label>
              <Input
                value={formData.numero}
                maxLength={8}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, numero: e.target.value }))
                }
              />
            </div>

            {/* Método de Pago */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Método de Pago *
              </label>
              <Select
                value={String(formData.metodoPagoId)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metodoPagoId: Number(e.target.value),
                  }))
                }
              >
                <option value="">Seleccionar</option>
                {data.data.opciones.metodosPago.map((metodo) => (
                  <option key={metodo.id} value={String(metodo.id)}>
                    {metodo.nombre}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </section>

        {/* Observaciones */}
        <section className="form-section bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="section-header border-b-2 border-gray-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-blue-800">Observaciones</h3>
          </div>
          <Input
            value={formData.observaciones}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, observaciones: e.target.value }))
            }
            placeholder="Observaciones generales del comprobante..."
          />
        </section>

        {/* Detalles */}
        <section className="form-section bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="section-header border-b-2 border-gray-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-blue-800">Detalles</h3>
          </div>

          {/* Tabla de productos */}
          <div className="overflow-x-auto mb-6 rounded-xl border">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-50 to-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Precio Unitario
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {formData.detalles.map((detalle, idx) => {
                  const ocItems = data.data.oc?.items ?? [];
                  const item =
                    ocItems.find((i) => i.productoId === detalle.productoId) ??
                    null;
                  const subtotal = detalle.cantidad * detalle.precioUnitario;

                  return (
                    <tr key={idx} className="bg-white/50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item?.producto ?? "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={detalle.cantidad}
                          onChange={(e) => {
                            const detalles = [...formData.detalles];
                            detalles[idx].cantidad = Number(e.target.value);
                            setFormData((prev) => ({ ...prev, detalles }));
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        ${detalle.precioUnitario.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ${subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  );
                })}
                {formData.detalles.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500"
                      colSpan={4}
                    >
                      No hay ítems cargados para esta orden de compra.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-pink-50 to-blue-50">
                  <td colSpan={3} className="text-right p-3 font-semibold">
                    Total:
                  </td>
                  <td className="p-3 text-lg font-bold text-blue-800">
                    ${totalComprobante.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="rounded-xl px-6 py-3"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white shadow-md"
          >
            {loading ? "Guardando..." : "Guardar Comprobante"}
          </Button>
        </div>
      </form>
    </div>
  );
}