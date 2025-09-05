'use client'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
const [open, setOpen] = useState(false)
const toggle = () => setOpen((v) => !v)
const close = () => setOpen(false)

return (
<div className="min-h-dvh">
<Header onToggleSidebar={toggle} isSidebarOpen={open} />
{/* Overlay */}
{open && <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />}
<Sidebar open={open} onClose={close} />
<main className="mx-auto max-w-7xl px-6 py-8 fade-in">{children}</main>
</div>
)

}