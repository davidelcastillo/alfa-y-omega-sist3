// src/components/usuarios/Filters.tsx
'use client'

import { useState, useEffect } from 'react'
import { Rol } from '@/generated/prisma'

export type UserFilters = {
  search: string
  rolId: string
  estado: string
}

type Props = {
  roles: Rol[]
  value: UserFilters
  onChange: (filters: UserFilters) => void
}

export default function Filters({ roles, value, onChange }: Props) {
  const [filters, setFilters] = useState<UserFilters>(value)

  useEffect(() => {
    setFilters(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleApply = () => {
    onChange(filters)
  }

  const handleClear = () => {
    const cleared = { search: '', rolId: '', estado: '' }
    setFilters(cleared)
    onChange(cleared)
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Búsqueda */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Nombre, email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-shadow"
          />
        </div>

        {/* Filtro por Rol */}
        <div>
          <label htmlFor="rolId" className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            id="rolId"
            name="rolId"
            value={filters.rolId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-shadow"
          >
            <option value="">Todos</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={filters.estado}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-shadow"
          >
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex items-end gap-4">
          <button
            onClick={handleApply}
            className="w-full btn-primary text-white px-6 py-2 rounded-xl font-semibold text-base"
          >
            Aplicar
          </button>
          <button
            onClick={handleClear}
            className="w-full px-6 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-base"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  )
}