// src/components/eco/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="section py-10 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Alfa y Omega — Todos los derechos reservados.</p>
        <p className="text-gray-500">Hecho por Orellana y GPT</p>
      </div>
    </footer>
  )
}
