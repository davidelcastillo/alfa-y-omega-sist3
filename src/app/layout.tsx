// src/app/layout.tsx
import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata = {
  title: 'ERP',
  description: 'Sistema Alfa & Omega',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${poppins.className} min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 antialiased text-base`}
      >
        {children}
      </body>
    </html>
  )
}
