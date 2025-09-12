'use client'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

type AppShellProps = {
    children: React.ReactNode
    /** opcional, por si querés sumar clases al contenedor principal */
    contentClassName?: string
    }

export default function AppShell({ children, contentClassName }: AppShellProps) {
    const [open, setOpen] = useState(false)
    const toggle = () => setOpen(v => !v)
    const close = () => setOpen(false)

    // FULL WIDTH permanente
    const containerClass =
        `mx-auto py-8 fade-in w-full max-w-none px-3 sm:px-4 lg:px-6 ${contentClassName ?? ''}`

    return (
        <div className="min-h-dvh">
        <Header onToggleSidebar={toggle} isSidebarOpen={open} />
        {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />}
        <Sidebar open={open} onClose={close} />

        <main className={containerClass}>{children}</main>
        </div>
    )
}
