import AppShell from '@/components/layout/AppShell'

export const metadata = { title: 'Comprobante Proveedor · ERP' }

export default function ComprobanteProveedorLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}