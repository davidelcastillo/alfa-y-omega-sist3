"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

interface DetalleComprobante {
  id: number
  fecha: string
  hora: string
  nro_comprobante: string | null
  proveedor: {
    id: number
    nombre: string
  }
  tipo_comprobante: string
  orden_compra: {
    id: number
    nro: string | null
  }
  deposito: {
    id: number
    nombre: string
  } | null
  estado: boolean
  observaciones: string | null
  totales: {
    items: number
    total_db: number
    total_calc: number
    saldo_db: number
    pagado_calc: number
  }
  items: {
    productoId: number
    producto: string
    rubro: string
    marca: string
    unidad: string
    cantidad: number
    precioUnitario: number
    descuento: number | null
    totalLinea: number
    observaciones: string | null
  }[]
}

export default function ComprobanteDetallePage({ params }: { params: { id: string } }) {
  const [comprobante, setComprobante] = useState<DetalleComprobante | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchComprobante = async () => {
      try {
        const res = await fetch(`/api/comprobantes-proveedor/${params.id}/detalle`)
        const json = await res.json()
        if (!res.ok || !json.ok) throw new Error(json.error || "Error al cargar el comprobante")
        setComprobante(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }
    fetchComprobante()
  }, [params.id])

  if (loading) return <div className="p-8">Cargando...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (!comprobante) return <div className="p-8">No se encontró el comprobante</div>

  const formatMoney = (amount: number) => 
    amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Comprobante #{comprobante.nro_comprobante || comprobante.id}
        </h1>
        <Button
          onClick={() => router.back()}
          variant="outline"
        >
          Volver
        </Button>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Información General</h2>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="text-gray-600">Fecha:</dt>
              <dd>{new Date(comprobante.fecha).toLocaleDateString()}</dd>
              <dt className="text-gray-600">Hora:</dt>
              <dd>{comprobante.hora}</dd>
              <dt className="text-gray-600">Tipo:</dt>
              <dd>{comprobante.tipo_comprobante}</dd>
              <dt className="text-gray-600">Estado:</dt>
              <dd className={comprobante.estado ? "text-green-600" : "text-red-600"}>
                {comprobante.estado ? "Activo" : "Inactivo"}
              </dd>
            </dl>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Proveedor</h2>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="text-gray-600">ID:</dt>
              <dd>{comprobante.proveedor.id}</dd>
              <dt className="text-gray-600">Nombre:</dt>
              <dd>{comprobante.proveedor.nombre}</dd>
            </dl>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Totales</h2>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="text-gray-600">Total:</dt>
              <dd className="font-semibold">{formatMoney(comprobante.totales.total_db)}</dd>
              <dt className="text-gray-600">Saldo:</dt>
              <dd className="font-semibold">{formatMoney(comprobante.totales.saldo_db)}</dd>
              <dt className="text-gray-600">Pagado:</dt>
              <dd className="font-semibold">{formatMoney(comprobante.totales.pagado_calc)}</dd>
            </dl>
          </div>

          {comprobante.deposito && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Depósito</h2>
              <dl className="grid grid-cols-2 gap-4">
                <dt className="text-gray-600">ID:</dt>
                <dd>{comprobante.deposito.id}</dd>
                <dt className="text-gray-600">Nombre:</dt>
                <dd>{comprobante.deposito.nombre}</dd>
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">
          Detalle de Items ({comprobante.totales.items})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Producto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rubro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Marca</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unidad</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Cantidad</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Precio Unit.</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Descuento</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comprobante.items.map((item, index) => (
                <tr key={item.productoId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.producto}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.rubro}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.marca}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.unidad}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">{item.cantidad}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">
                    {formatMoney(item.precioUnitario)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">
                    {item.descuento ? `${item.descuento}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    {formatMoney(item.totalLinea)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={7} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Total:
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {formatMoney(comprobante.totales.total_db)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Observaciones */}
      {comprobante.observaciones && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Observaciones</h2>
          <p className="text-gray-700">{comprobante.observaciones}</p>
        </div>
      )}
    </div>
  )
}
