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
  rubros: _rubrosProp,
  onClose,
  onSave,
}: {
  open: boolean
  product?: Product | null
  rubros: readonly string[]
  onClose: () => void
  onSave: (payload: { id?: number; [key: string]: any }) => Promise<void>
}) {
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    descripcion: '',
    rubro: '',
    marca: '',
    unidad: 'Unidad',
    estado: 'Activo',
  })
  const [nombre, setNombre] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [catalogs, setCatalogs] = useState<{
    rubros: CatalogoOption[]
    marcas: CatalogoOption[]
    unidades: CatalogoOption[]
  }>({ rubros: [], marcas: [], unidades: [] })
  const [loadingCats, setLoadingCats] = useState(false)
  const [catsError, setCatsError] = useState<string | null>(null)

  const [sel, setSel] = useState<{ rubroId: number | 0; marcaId: number | 0; unidadId: number | 0 }>({
    rubroId: 0,
    marcaId: 0,
    unidadId: 0,
  })


  useEffect(() => {
    if (product) {
      setForm({
        descripcion: product.descripcion,
        rubro: product.rubro,
        marca: product.marca,
        unidad: product.unidad,
        estado: product.estado,
      });
      setNombre((product as any).nombre);
      setSel({
        rubroId: (product as any).rubroId || 0,
        marcaId: (product as any).marcaId || 0,
        unidadId: (product as any).unidadId || 0,
      });
     
    } else {
      setForm({
        descripcion: '',
        rubro: '',
        marca: '',
        unidad: 'Unidad',
        estado: 'Activo',
      });
      setNombre('');
      setSel({ rubroId: 0, marcaId: 0, unidadId: 0 });
    }
  }, [product, open]); 

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
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...(product && { id: product.id }),
      nombre: nombre.trim() || 'Producto sin nombre',
      descripcion: form.descripcion || '',
      rubroId: sel.rubroId || 0,
      marcaId: sel.marcaId || 0,
      unidadId: sel.unidadId || 0,
      estado: form.estado === 'Activo',
    };

    try {
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      // Podrías mostrar un mensaje de error aquí si lo deseas
    } finally {
      setIsSaving(false);
    }
  };

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
              options={catalogs.marcas}
              valueId={sel.marcaId || 0}
              onChange={(opt) => {
                setSel({ ...sel, marcaId: opt?.id ?? 0 })
                setForm({ ...form, marca: opt?.nombre ?? '' })
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
            <Button type="submit" className="px-6" disabled={loadingCats || isSaving}>
              {isSaving ? 'Guardando…' : 'Guardar Producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
