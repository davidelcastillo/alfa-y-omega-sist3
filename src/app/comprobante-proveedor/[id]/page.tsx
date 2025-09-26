"use client"

import { useEffect, useState } from "react"

export default function ComprobanteDetallePage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/comprobantes-proveedor/${params.id}`)
        const json = await res.json()
        if (!res.ok || json.ok === false) throw new Error(json.error || "Error cargando comprobante")
        setData(json.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  if (loading) return <p className="p-6">Cargando...</p>
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Detalle Comprobante #{data.id}</h1>
      <p>Proveedor: {data.proveedor.nombre}</p>
      <p>Fecha: {data.fecha}</p>
      <p>Total: ${data.totales.total_db}</p>
      <p>Saldo: ${data.totales.saldo_db}</p>
      <h2 className="text-xl font-semibold">Items</h2>
      <ul>
        {data.items.map((i: any, idx: number) => (
          <li key={idx}>
            {i.producto} - {i.cantidad} x ${i.precioUnitario}
          </li>
        ))}
      </ul>
    </div>
  )
}
