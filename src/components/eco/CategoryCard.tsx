// src/components/eco/CategoryCard.tsx
import Link from "next/link";

type Category = { id: number; nombre: string; slug: string };

export default function CategoryCard({ c }: { c: Category }) {
  return (
    <Link
      href={`/eco/categoria/${c.slug}?rubroId=${c.id}`}
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
