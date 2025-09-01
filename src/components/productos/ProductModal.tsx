'use client'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SearchableSelect from '@/components/ui/SearchableSelect'


type CatalogoOption = { id: number; nombre: string }

export default function ProductModal({
  open,
  product,
  rubros: _rubrosProp, // ya no se usa; ahora vienen de la API
  onClose,
  onSave,
}: {
  open: boolean
  product?: Product | null
  rubros: readonly string[]
  onClose: () => void
  onSave: (payload: Omit<Product, 'id'> & { id?: number }) => void
}) {
  // Estado original de tu form (texto/números)
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    descripcion: '',
    rubro: '',
    marca: '',
    unidad: 'Unidad',
    precioVenta: 0,
    precioLista: 0,
    estado: 'Activo',
  })
  const [nombre, setNombre] = useState('')

  // Catálogos desde la BD
  const [catalogs, setCatalogs] = useState<{
    rubros: CatalogoOption[]
    marcas: CatalogoOption[]
    unidades: CatalogoOption[]
  }>({ rubros: [], marcas: [], unidades: [] })
  const [loadingCats, setLoadingCats] = useState(false)
  const [catsError, setCatsError] = useState<string | null>(null)

  // IDs seleccionados para enviar al backend
  const [sel, setSel] = useState<{ rubroId: number | 0; marcaId: number | 0; unidadId: number | 0 }>({
    rubroId: 0,
    marcaId: 0,
    unidadId: 0,
  })

  // Reset form cuando abre o cambia el producto
  useEffect(() => {
    if (product) {
      const { id, ...rest } = product
      setForm(rest)
      setNombre('')
    } else {
      setForm({
        descripcion: '',
        rubro: '',
        marca: '',
        unidad: 'Unidad',
        precioVenta: 0,
        precioLista: 0,
        estado: 'Activo',
      })
      setNombre('')
    }
  }, [product, open])

  // Cargar catálogos al abrir el modal
  useEffect(() => {
    if (!open) return
    let alive = true
    ;(async () => {
      setLoadingCats(true)
      setCatsError(null)
      try {
        const res = await fetch('/api/productos/catalogos')
        const json = await res.json()
        if (!res.ok || !json?.ok) throw new Error(json?.error ?? 'No se pudo cargar catálogos')

        const rubros: CatalogoOption[] = json.data.rubros ?? []
        const marcas: CatalogoOption[] = json.data.marcas ?? []
        const unidades: CatalogoOption[] = json.data.unidades ?? []

        if (!alive) return
        setCatalogs({ rubros, marcas, unidades })

        // Preseleccionar primeros valores si no hay selección previa
        setSel((prev) => ({
          rubroId: prev.rubroId || rubros[0]?.id || 0,
          marcaId: prev.marcaId || marcas[0]?.id || 0,   // aunque no lo muestres aún
          unidadId: prev.unidadId || unidades[0]?.id || 0,
        }))
      } catch (e) {
        if (!alive) return
        setCatsError((e as Error).message)
      } finally {
        if (alive) setLoadingCats(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const rubroId = sel.rubroId || catalogs.rubros[0]?.id || 1
    const marcaId = sel.marcaId || catalogs.marcas[0]?.id || 1
    const unidadId = sel.unidadId || catalogs.unidades[0]?.id || 1

    const payload = {
      nombre: nombre.trim() || 'Producto sin nombre',
      descripcion: form.descripcion || '',
      rubroId,
      marcaId,
      unidadId,
      precioCompra: Number(form.precioLista) || 0,
      precioVenta: Number(form.precioVenta) || 0,
      estado: form.estado === 'Activo',
    }

    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await res.json()
    if (!res.ok) {
      console.error(json)
      alert(`Error al crear: ${json?.error ?? 'desconocido'}`)
      return
    }

    // Avisar al padre / refrescar tabla (mantengo tu contrato)
    onSave?.(product ? { ...form, id: product.id } : form)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-2" aria-label="Cerrar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nombre *" required value={nombre} onChange={(e) => setNombre(e.target.value)} />

            <Input
              label="Descripción *"
              required
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />

            {/* Rubro desde BD */}
            <Select
              label="Rubro *"
              required
              value={sel.rubroId ? String(sel.rubroId) : ''}
              onChange={(e) => setSel({ ...sel, rubroId: Number(e.target.value) })}
              disabled={loadingCats || !!catsError || catalogs.rubros.length === 0}
            >
              {!loadingCats && catalogs.rubros.length === 0 && <option value="">No hay rubros</option>}
              {loadingCats && <option value="">Cargando rubros...</option>}
              {!loadingCats &&
                catalogs.rubros.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
            </Select>

            {/* Marcas con autocompletado*/}
            <SearchableSelect
              label="Marca *"
              options={catalogs.marcas}        // viene del GET /api/productos/catalogos
              valueId={sel.marcaId || 0}
              onChange={(opt) => {
                setSel({ ...sel, marcaId: opt?.id ?? 0 })
                setForm({ ...form, marca: opt?.nombre ?? '' }) // opcional, solo para mostrar texto
              }}
            />

            {/* Unidad desde BD */}
            <Select
              label="Unidad *"
              required
              value={sel.unidadId ? String(sel.unidadId) : ''}
              onChange={(e) => setSel({ ...sel, unidadId: Number(e.target.value) })}
              disabled={loadingCats || !!catsError || catalogs.unidades.length === 0}
            >
              {!loadingCats && catalogs.unidades.length === 0 && <option value="">No hay unidades</option>}
              {loadingCats && <option value="">Cargando unidades...</option>}
              {!loadingCats &&
                catalogs.unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre}
                  </option>
                ))}
            </Select>

            <Input
              label="Precio Venta *"
              type="number"
              step="0.1"
              required
              value={form.precioVenta}
              onChange={(e) => setForm({ ...form, precioVenta: Number(e.target.value || 0) })}
            />
            <Input
              label="Precio Lista *"
              type="number"
              step="0.1"
              required
              value={form.precioLista}
              onChange={(e) => setForm({ ...form, precioLista: Number(e.target.value || 0) })}
            />

            <Select
              label="Estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as Product['estado'] })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Select>
          </div>

          {catsError && (
            <p className="mt-4 text-sm text-red-600">
              No se pudieron cargar los catálogos. Podés reintentar o crear luego.
            </p>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onClose} className="px-8">
              Cancelar
            </Button>
            <Button type="submit" className="px-8" disabled={loadingCats}>
              {loadingCats ? 'Guardando…' : 'Guardar Producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
