'use client';

import { useEffect, useMemo, useState } from 'react';
import type { UIProduct } from '@/lib/types'; // <- lo que realmente exportás
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchableSelect from '@/components/ui/SearchableSelect';

type CatalogoOption = { id: number; nombre: string };

// payload que espera tu API
type ProductSavePayload = {
  id?: number;
  nombre: string;
  descripcion?: string;
  rubroId: number;
  marcaId: number;
  unidadId: number;
  estado: boolean;         // en DB es Boolean
};

type Props = {
  open: boolean;
  product?: UIProduct | null; // para editar (UIProduct es tu tipo exportado)
  onClose: () => void;
  onSave: (payload: ProductSavePayload) => Promise<void>;
};

// estado del form (solo lo que editás aquí)
type FormState = {
  descripcion: string;
  rubro: string;
  marca: string;
  unidad: string;
  estado: 'Activo' | 'Inactivo';
};

export default function ProductModal({ open, product, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>({
    descripcion: '',
    rubro: '',
    marca: '',
    unidad: 'Unidad',
    estado: 'Activo',
  });
  const [nombre, setNombre] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [catalogs, setCatalogs] = useState<{
    rubros: CatalogoOption[];
    marcas: CatalogoOption[];
    unidades: CatalogoOption[];
  }>({ rubros: [], marcas: [], unidades: [] });
  const [loadingCats, setLoadingCats] = useState(false);
  const [catsError, setCatsError] = useState<string | null>(null);

  const [sel, setSel] = useState<{ rubroId: number; marcaId: number; unidadId: number }>({
    rubroId: 0,
    marcaId: 0,
    unidadId: 0,
  });

  // Normaliza opciones para SearchableSelect -> { id: string; name: string }
  const marcasUi = useMemo(
    () => catalogs.marcas.map(m => ({ id: String(m.id), name: m.nombre })),
    [catalogs.marcas]
  );

  useEffect(() => {
    if (product) {
      // UIProduct no declara marcaId; lo intentamos leer si viene
      const extras = product as Partial<UIProduct & { marcaId: number; unidadId: number }>;
      setForm({
        descripcion: product.descripcion ?? '',
        rubro: product.rubro,
        marca: product.marca,
        unidad: product.unidad,
        estado: product.estado,
      });
      setNombre(product.nombre ?? '');
      setSel({
        rubroId: extras.rubroId ?? 0,
        marcaId: (extras as any).marcaId ?? 0,   // si no está, quedará 0 y se fuerza selección
        unidadId: extras.unidadId ?? 0,
      });
    } else {
      setForm({ descripcion: '', rubro: '', marca: '', unidad: 'Unidad', estado: 'Activo' });
      setNombre('');
      setSel({ rubroId: 0, marcaId: 0, unidadId: 0 });
    }
  }, [product, open]);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      setLoadingCats(true);
      setCatsError(null);
      try {
        const res = await fetch('/api/productos/catalogos');
        const json = await res.json();
        if (!res.ok || !json?.ok) throw new Error(json?.error ?? 'No se pudo cargar catálogos');

        const rubros: CatalogoOption[] = json.data.rubros ?? [];
        const marcas: CatalogoOption[] = json.data.marcas ?? [];
        const unidades: CatalogoOption[] = json.data.unidades ?? [];

        if (!alive) return;
        setCatalogs({ rubros, marcas, unidades });

        setSel(prev => ({
          rubroId: prev.rubroId || (rubros[0]?.id ?? 0),
          marcaId: prev.marcaId || (marcas[0]?.id ?? 0),
          unidadId: prev.unidadId || (unidades[0]?.id ?? 0),
        }));
      } catch (e) {
        if (!alive) return;
        setCatsError((e as Error).message);
      } finally {
        if (alive) setLoadingCats(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (sel.rubroId <= 0 || sel.marcaId <= 0 || sel.unidadId <= 0) {
      alert('Debes seleccionar un Rubro, Marca y Unidad válidos antes de guardar.');
      setIsSaving(false);
      return;
    }

    const payload: ProductSavePayload = {
      ...(product?.id ? { id: product.id } : {}),
      nombre: (nombre ?? '').trim() || 'Producto sin nombre',
      descripcion: (form.descripcion ?? '').trim() || undefined,
      rubroId: sel.rubroId,
      marcaId: sel.marcaId,
      unidadId: sel.unidadId,
      estado: form.estado === 'Activo',
    };

    try {
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

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

            {/* Rubro desde BD (Select nativo) */}
            <Select
              label="Rubro *"
              required
              value={sel.rubroId ? String(sel.rubroId) : ''}
              onChange={(e) => setSel({ ...sel, rubroId: Number(e.target.value) || 0 })}
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

            {/* Marca (SearchableSelect -> {id:string, name:string}) */}
            <SearchableSelect
              key={`marca-${sel.marcaId}-${open ? 1 : 0}`}
              label="Marca *"
              options={[{ id: '0', name: 'Seleccionar…' }, ...marcasUi]}
              valueId={String(sel.marcaId || 0)}
              onChange={(opt) => {
                const id = opt ? Number(opt.id) : 0;
                setSel({ ...sel, marcaId: id });
                setForm({ ...form, marca: opt?.name ?? '' });
              }}
              placeholder="Buscar marca…"
            />

            {/* Unidad desde BD (Select nativo) */}
            <Select
              label="Unidad *"
              required
              value={sel.unidadId ? String(sel.unidadId) : ''}
              onChange={(e) => setSel({ ...sel, unidadId: Number(e.target.value) || 0 })}
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
              onChange={(e) => setForm({ ...form, estado: e.target.value as UIProduct['estado'] })}
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
  );
}
