'use client'
import { useEffect, useMemo, useState } from 'react'

type Option = { id: number; nombre: string }

export default function SearchableSelect({
  label = 'Marca *',
  options,
  valueId,
  onChange,
  placeholder = 'Escribí para buscar…',
}: {
  label?: string
  options: Option[]
  valueId: number | 0
  onChange: (opt: Option | null) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const selected = useMemo(
    () => options.find((o) => o.id === valueId) || null,
    [options, valueId]
  )

  // Sincroniza el texto con la opción seleccionada
  useEffect(() => {
    if (selected) setText(selected.nombre)
  }, [selected?.id])

  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase()
    if (!q) return options.slice(0, 12)
    return options.filter((o) => o.nombre.toLowerCase().includes(q)).slice(0, 12)
  }, [options, text])

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        value={text}
        onChange={(e) => { setText(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} /* permite clickear las opciones */
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all"
      />
      {open && (
        <ul className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-500">Sin resultados</li>
          )}
          {filtered.map((opt) => (
            <li
              key={opt.id}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setText(opt.nombre); setOpen(false) }}
              className="px-4 py-3 cursor-pointer hover:bg-light-pink/50"
            >
              {opt.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
