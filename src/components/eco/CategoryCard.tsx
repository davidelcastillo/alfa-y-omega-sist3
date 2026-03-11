// src/components/eco/CategoryCard.tsx
import Link from "next/link";

// El tipo puede simplificarse, ya no necesitamos el slug aquí.
type Category = { id: number; nombre: string };

export default function CategoryCard({ c }: { c: Category }) {
  // --- CORRECCIÓN AQUÍ ---
  // Construimos el enlace para que apunte a nuestra página de filtros principal,
  // usando el nombre de parámetro correcto: 'categoryId'.
  const href = `/eco/productos?categoryId=${c.id}`;
  // --- FIN DE LA CORRECCIÓN ---

  return (
    <Link
      href={href}
      className="glass rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition"
    >
      <div>
        <h3 className="font-semibold">{c.nombre}</h3>
        <p className="text-xs text-gray-500">Ver productos</p>
      </div>
      <span className="text-2xl">🛒</span>
    </Link>
  );
}