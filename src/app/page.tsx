import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

export default function HomePage() {
  return (
    <AppShell>
    <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <span>Inicio</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
            Bienvenido al ERP
          </h2>
          <p className="text-gray-600 text-lg">Elegí un módulo para comenzar:</p>
        </div> 
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" >
          <Link href="/productos" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Productos</h2>
            <p className="text-gray-600">Gestión de catálogo, precios y estado.</p>
          </Link>
          <Link href="/depositos" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Depósitos</h2>
            <p className="text-gray-600">Administración de depósitos y capacidades.</p>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/movimientos" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Movimientos de stock</h2>
            <p className="text-gray-600">Historial completo de ingresos y egresos de inventario.</p>
          </Link>
          <Link href="/proveedores" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Proveedores</h2>
            <p className="text-gray-600">Administra y controla toda la información de tus proveedores.</p>
          </Link>
        </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/compras" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Órdenes de compras</h2>
            <p className="text-gray-600">Administra y controla todas las órdenes de compra.</p>
          </Link>
          <Link href="/comprobante-proveedor" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Comprobantes de proveedor</h2>
            <p className="text-gray-600">Administra y controla todos los comprobantes de proveedor.</p>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/pagos" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Pagos a proveedor</h2>
            <p className="text-gray-600">Administra y controla todos los pagos a proveedores.</p>
          </Link>
          <Link href="/ventas" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Ventas</h2>
            <p className="text-gray-600">Gestiona y controla todos los pedidos de ventas.</p>
          </Link>
        </div>
      </div>
    </main>
    </AppShell>
  )
}
