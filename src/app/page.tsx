// 1. SOLUCIÓN: Directiva para que el buscador (useState) funcione
'use client'

import { useState } from 'react'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import {
  Boxes, Warehouse, MoveRight, Truck, ShoppingCart,
  ReceiptText, CreditCard, Users2, BarChart3,
  Search, ClipboardCheck, DollarSign,
  // 2. NUEVO: Ícono para el botón de E-commerce
  Store
} from "lucide-react";

const modules = [
  // ... (la lista de módulos no cambia, la omito por brevedad)
  { href: '/productos', icon: Boxes, title: 'Productos', description: 'Gestión de catálogo, precios y estado.' },
  { href: '/depositos', icon: Warehouse, title: 'Depósitos', description: 'Administración de depósitos y capacidades.' },
  { href: '/movimientos', icon: MoveRight, title: 'Movimientos de stock', description: 'Historial completo de ingresos y egresos.' },
  { href: '/proveedores', icon: Truck, title: 'Proveedores', description: 'Administra la información de tus proveedores.' },
  { href: '/compras', icon: ShoppingCart, title: 'Órdenes de compras', description: 'Administra y controla todas las órdenes de compra.' },
  { href: '/comprobante-proveedor', icon: ReceiptText, title: 'Comprobantes de proveedor', description: 'Controla los comprobantes de proveedor.' },
  { href: '/pagos', icon: CreditCard, title: 'Pagos a proveedor', description: 'Administra y controla todos los pagos.' },
  { href: '/ventas', icon: DollarSign, title: 'Ventas', description: 'Gestiona y controla todos los pedidos de ventas.' },
    { href: '/facturas', icon: ClipboardCheck, title: 'Facturas', description: 'Gestiona y controla todos los comprobantes de clientes.'},
  { href: '/usuarios', icon: Users2, title: 'Gestión de Usuarios', description: 'Administra y controla los usuarios del sistema.' },
  { href: '/dashboard', icon: BarChart3, title: 'Resumen del Corralón', description: 'Ingresos, egresos y resultado por período.' },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-3">
            Bienvenido al Sistema de Gestión
          </h1>
          <p className="text-gray-600 text-lg">Seleccioná un módulo o visitá nuestra tienda online.</p>
        </div>

        {/* 3. NUEVO: Botón de E-commerce */}
        <div className="flex justify-center mb-10">
          <Link
            href="/eco/inicio"
            className="inline-flex items-center gap-x-3 bg-gradient-to-r from-primary-pink to-primary-blue text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out"
          >
            <Store className="h-6 w-6" />
            <span>Ir al E-commerce</span>
          </Link>
        </div>

        {/* Input del buscador */}
        <div className="mb-10 max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar un módulo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Módulos (ahora usa `filteredModules`) */}
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map((module) => (
              <Link href={module.href} key={module.href} className="glass-effect rounded-2xl p-6 card-hover flex flex-col items-start text-left">
                <div className="bg-blue-100 text-primary-blue rounded-lg p-3 mb-4">
                  <module.icon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{module.title}</h2>
                <p className="text-gray-600 text-sm flex-grow">{module.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No se encontraron módulos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </main>
    </AppShell>
  )
}