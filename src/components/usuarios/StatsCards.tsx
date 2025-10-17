// src/components/usuarios/StatsCards.tsx
'use client'

import { UserWithRole } from '@/server/usuarios/usuarios.service'

type Props = {
  users: UserWithRole[]
}

export default function StatsCards({ users }: Props) {
  const total = users.length
  const activos = users.filter(u => u.activo).length
  const inactivos = total - activos

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-medium text-gray-500">Total de Usuarios</h3>
        <p className="text-4xl font-bold text-primary-blue mt-2">{total}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-medium text-gray-500">Usuarios Activos</h3>
        <p className="text-4xl font-bold text-green-500 mt-2">{activos}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-medium text-gray-500">Usuarios Inactivos</h3>
        <p className="text-4xl font-bold text-red-500 mt-2">{inactivos}</p>
      </div>
    </div>
  )
}