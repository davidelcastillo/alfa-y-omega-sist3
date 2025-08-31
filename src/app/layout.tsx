import type { Metadata } from 'next'
import './globals.css'
import { Poppins } from 'next/font/google'
import AppShell from '@/components/layout/AppShell'

const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','500','600','700'], display: 'swap' })

export const metadata: Metadata = {
  title: 'ERP Sistema - Módulo Productos',
  description: 'Gestión de productos con Next.js + Tailwind',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${poppins.className} min-h-dvh bg-gradient-to-br from-gray-50 to-blue-50`}>
        <AppShell>{children}</AppShell>
      </body>

    </html>
  )
}