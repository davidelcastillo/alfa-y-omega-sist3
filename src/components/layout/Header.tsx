'use client'
import { cn } from '@/lib/utils'


export default function Header({ onToggleSidebar, isSidebarOpen = false }: { onToggleSidebar: () => void; isSidebarOpen?: boolean }) {
return (
<header className="glass-effect shadow-lg sticky top-0 z-40">
<div className="max-w-7xl mx-auto px-6 py-4">
<div className="flex items-center justify-between">
{/* El menu desplegable */}
<div className="flex items-center">
<button onClick={onToggleSidebar} className={cn('p-2 rounded-lg hover:bg-light-pink transition-colors', isSidebarOpen && 'hamburger-active')} aria-label="Abrir/Cerrar menú">
<div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
<div className="hamburger-line w-6 h-0.5 bg-dark-blue" />
<div className="hamburger-line w-6 h-0.5 bg-dark-blue" />
<div className="hamburger-line w-6 h-0.5 bg-dark-blue" />
</div>
</button>
</div>


{/* Marca */}
<div className="flex items-center space-x-3">
<div className="w-12 h-12 bg-gradient-to-br from-primary-pink to-primary-blue rounded-xl flex items-center justify-center logo-glow">
<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
</svg>
</div>
<div className="text-right">
<h1 className="text-2xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent">ERP Pro</h1>
<p className="text-sm text-gray-600 font-medium">Sistema Integral</p>
</div>
</div>
</div>
</div>
</header>
)
}