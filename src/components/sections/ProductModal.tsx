'use client'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function ProductModal({ open, product, rubros, onClose, onSave }: {
open: boolean
product?: Product | null
rubros: readonly string[]
onClose: () => void
onSave: (payload: Omit<Product, 'id'> & { id?: number }) => void
}) {
const [form, setForm] = useState<Omit<Product, 'id'>>({ descripcion: '', rubro: '', marca: '', unidad: 'Unidad', precioVenta: 0, precioLista: 0, estado: 'Activo' })
const [nombre, setNombre] = useState('');

useEffect(() => {
if (product) {
  const { id, ...rest } = product
  setForm(rest)
  setNombre('');
} else {
  setForm({ descripcion: '', rubro: '', marca: '', unidad: 'Unidad', precioVenta: 0, precioLista: 0, estado: 'Activo' })
  setNombre('');
}
}, [product, open])

/*const handleSubmit = (e: React.FormEvent) => {
e.preventDefault()
onSave(product ? { ...form, id: product.id } : form)
}  esto servia*/
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Map rápido desde tu form actual -> DTO del backend
  const payload = {
    nombre: nombre.trim() || 'Producto sin nombre',
    descripcion: form.descripcion || '',
    rubroId: 1,     //fijo por ahora
    marcaId: 1,     //fijo por ahora
    unidadId: 1,    //fijo por ahora
    precioCompra: Number(form.precioLista) || 0,  // usamos 'precioLista' como compra
    precioVenta: Number(form.precioVenta) || 0,
    estado: form.estado === 'Activo',             
  };

  const res = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    console.error(json);
    alert(`Error al crear: ${json?.error ?? 'desconocido'}`);
    return;
  }

  // Opcional: avisar al padre / refrescar tabla
  onSave?.(product ? { ...form, id: product.id } : form);
  onClose();
};

if (!open) return null

  return (
<div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
<div className="glass-effect rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
<div className="bg-gradient-to-r from-primary-pink to-light-pink p-6 rounded-t-2xl flex items-center justify-between">
<h3 className="text-2xl font-bold text-white">{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
<button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-2" aria-label="Cerrar">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
</button>
</div>


<form onSubmit={handleSubmit} className="p-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input label="Nombre *" required value={nombre} onChange={(e) => setNombre(e.target.value)}/>
    <Input label="Descripción *" required value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
    <Select label="Rubro *" required value={form.rubro} onChange={(e) => setForm({ ...form, rubro: e.target.value })}>
      <option value="">Seleccionar rubro</option>
      {rubros.map((r) => (<option key={r} value={r}>{r}</option>))}
</Select>
<Input label="Marca *" required value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} />
<Select label="Unidad *" required value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })}>
{['Unidad','Kg','Lt','Mt','Caja','Par'].map((u) => (<option key={u} value={u}>{u}</option>))}
</Select>
      <Input label="Precio Venta *" type="number" step="0.1" required value={form.precioVenta} onChange={(e) => setForm({ ...form, precioVenta: Number(e.target.value || 0) })} />
      <Input label="Precio Lista *" type="number" step="0.1" required value={form.precioLista} onChange={(e) => setForm({ ...form, precioLista: Number(e.target.value || 0) })} />
<Select label="Estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as Product['estado'] })}>
<option value="Activo">Activo</option>
<option value="Inactivo">Inactivo</option>
</Select>
</div>


<div className="flex justify-end gap-4 mt-8">
  <Button type="button" variant="outline" onClick={onClose} className="px-8">
    Cancelar
  </Button>
  <Button type="submit" className="px-8">
    Guardar Producto
  </Button>
</div>
</form>
</div>
</div>
)
}