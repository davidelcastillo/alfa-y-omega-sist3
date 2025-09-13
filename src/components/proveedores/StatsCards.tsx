// components/proveedores/StatsCards.tsx
import React from "react";

type StatsCardsProps = {
  total: number;
  activos: number;
  inactivos: number;
};

export default function StatsCards({ total, activos, inactivos }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Proveedores</p>
            <p className="text-3xl font-bold text-dark-blue">{total}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-pink to-light-pink rounded-xl flex items-center justify-center">
            {/* ícono genérico */}
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Proveedores Activos</p>
            <p className="text-3xl font-bold text-green-600">{activos}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Proveedores Inactivos</p>
            <p className="text-3xl font-bold text-red-500">{inactivos}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
