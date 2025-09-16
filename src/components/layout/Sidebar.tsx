'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
{ label: 'Productos', href: '/productos', active: true, icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
)},
{ label: 'Depósito', href: '/depositos', icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
)},
/*{ label: 'Stock por Depósito', href: '/depositos/stock', icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
)},*/
{ label: 'Movimiento de Stock', href: '/movimientos', icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
)},
{ label: 'Compra', href: '#', icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/></svg>
)},
{ label: 'Venta', href: '#', icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
)},
{ label: 'Proveedor', href: '/proveedores', icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
)},
{ label: 'Reportes', href: '#', icon: (
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
)},
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-80 glass-effect transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0 slide-in' : '-translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
<div className="flex items-center justify-between mb-8">
<h2 className="text-xl font-bold text-dark-blue">Módulos del Sistema</h2>
<button onClick={onClose} className="p-2 rounded-lg hover:bg-light-pink transition-colors" aria-label="Cerrar menú">
<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
</button>
</div>
<nav className="space-y-2">
          {items.map((it) => {
            const isActive = pathname.startsWith(it.href) // 👈 resalta también subrutas /productos/...
            return (
              <Link
                key={it.label}
                href={it.href}
                aria-current={isActive ? 'page' : undefined}
                className={`menu-item flex items-center space-x-4 p-4 rounded-xl ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-primary-pink to-primary-blue'
                    : 'text-gray-700 hover:text-white'
                }`}
              >
                {it.icon}
                <span className="font-medium">{it.label}</span>
              </Link>
            )
          })}
        </nav>
<div className="mt-auto pt-6 text-xs text-gray-500">v1.0.0</div>
</div>
</aside>
)
}

