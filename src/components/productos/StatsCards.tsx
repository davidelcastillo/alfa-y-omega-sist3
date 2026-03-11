import { Product } from '@/lib/types'

type Card = {
    label: string
    value: string | number
    iconBg: string
    valueClass: string
    icon: 'box' | 'check' | 'x' 
}

function Icon({ name }: { name: Card['icon'] }) {
    const cls = 'w-6 h-6 text-white'
    switch (name) {
    // ========== ICONO 1 ==========
    case 'box':
        return (
            <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )
    // ========== ICONO 2 ==========
    case 'check':
        return (
            <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    // ========== ICONO 3 ==========
    case 'x':
        return (
            <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
}

export default function StatsCards({ products }: { products: Product[] }) {
const total = products.length
const activos = products.filter(p => p.estado === 'Activo').length
const inactivos = total - activos

const cards: Card[] = [
    { label: 'Total Productos',     value: total,                     iconBg: 'from-primary-pink to-light-pink', valueClass: 'text-dark-blue',   icon: 'box'   },
    { label: 'Productos Activos',   value: activos,                   iconBg: 'from-green-400 to-green-600',     valueClass: 'text-green-600',   icon: 'check' },
    { label: 'Productos Inactivos', value: inactivos,                 iconBg: 'from-red-400 to-red-600',         valueClass: 'text-red-500',     icon: 'x'     },
]

return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((c) => (
            <div key={c.label} className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-gray-600 text-sm font-medium">{c.label}</p>
                <p className={`text-3xl font-bold ${c.valueClass}`}>{c.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${c.iconBg} rounded-xl flex items-center justify-center`}>
                <Icon name={c.icon} />
                </div>
            </div>
            </div>
        ))}
        </div>
    )
}