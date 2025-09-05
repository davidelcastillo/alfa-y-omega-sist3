import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

export default function HomePage() {
  return (
    <AppShell>
      <main className="max-w-7xl mx-auto px-6 py-12">
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
          <p className="text-gray-600 text-lg">Elegí un módulo para comenzar: (este diseño es provisional, si gusta idea entonces lo mejoro)</p>
        </div> 
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/productos" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Productos</h2>
            <p className="text-gray-600">Gestión de catálogo, precios y estado.</p>
          </Link>
          <Link href="/depositos" className="glass-effect rounded-2xl p-6 card-hover">
            <h2 className="text-2xl font-semibold mb-2">Depósitos</h2>
            <p className="text-gray-600">Administración de depósitos y capacidades.</p>
          </Link>
        </div>
      </main>
    </AppShell>
  )
}
