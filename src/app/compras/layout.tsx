import AppShell from '@/components/layout/AppShell'

export const metadata = { title: 'Ordenes de compra · ERP' }

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}