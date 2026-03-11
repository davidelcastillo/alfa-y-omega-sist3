// src/app/facturas/layout.tsx
import AppShell from '@/components/layout/AppShell'

export const metadata = { title: 'Facturas · ERP' } // <-- MODIFICADO

export default function FacturasLayout({ children }: { children: React.ReactNode }) { // <-- MODIFICADO
  return <AppShell>{children}</AppShell>
}