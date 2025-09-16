import AppShell from '@/components/layout/AppShell'

export const metadata = { title: 'Movimientos · ERP' }

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}