// src/components/eco/Categories.tsx
import CategoriesClient from "./CategoriesClient";
import { slugify } from "@/lib/eco/slug";
import { getBaseUrlServer } from '@/lib/eco/http-server';

type Rubro = { id: number; nombre: string };
type CatalogosResponse = {
  ok: boolean;
  data?: { rubros: Rubro[]; marcas: any[]; unidades: any[] };
  error?: string;
};

export default async function Categories() {
  const base = await getBaseUrlServer(); // 👈 AWAIT
  const url  = new URL('/api/productos/catalogos', base); // evita // o strings raros

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    return (
      <section id="categorias" className="section py-12">
        <h2 className="text-2xl font-bold mb-6">Categorías</h2>
        <p className="text-sm text-red-600">No se pudieron cargar las categorías.</p>
      </section>
    );
  }

  const json = (await res.json()) as CatalogosResponse;
  const rubros = json.ok ? json.data?.rubros ?? [] : [];

  const items = rubros.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    slug: slugify(r.nombre),
  }));

  return (
    <section id="categorias" className="section py-12">
      <h2 className="text-2xl font-bold mb-6">Categorías</h2>
      <CategoriesClient items={items} visibleCount={5} />
    </section>
  );
}
