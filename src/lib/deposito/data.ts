//para llamar el deposito

export type DepositoDTO = {
  id: number
  nombre: string
  ubicacion?: string | null
  tipo?: string | null
  provincia?: string | null
  ciudad?: string | null
  estado?: boolean | null
}

export async function fetchDepositos(params?: {
  search?: string
  tipo?: string
  estado?: "Activo" | "Inactivo"
}): Promise<DepositoDTO[]> {
  const qs = new URLSearchParams()
  if (params?.search) qs.set("search", params.search)
  if (params?.tipo) qs.set("tipo", params.tipo)
  if (params?.estado) qs.set("estado", params.estado)

  const res = await fetch(`/api/deposito?${qs.toString()}`, { cache: "no-store" })
  if (!res.ok) throw new Error("No se pudo obtener depósitos")
  const json = await res.json()
  return json.data as DepositoDTO[]
}
