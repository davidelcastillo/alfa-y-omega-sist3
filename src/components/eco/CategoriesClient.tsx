// src/components/eco/CategoriesClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";

type Item = { id: number; nombre: string; slug: string };

export default function CategoriesClient({
  items,
  visibleCount = 5, // cuántas “entran” a la vista aprox.
}: {
  items: Item[];
  visibleCount?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // calcula si se puede scrollear
  function refreshArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    refreshArrows();
    const onScroll = () => refreshArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => refreshArrows());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // ancho de tarjeta aproximado según visibleCount
  const cardWidth = 100 / Math.max(1, visibleCount);

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = (el.clientWidth * 0.9) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!items.length) {
    return <div className="text-sm text-gray-500">No hay rubros disponibles.</div>;
  }

  return (
    <div className="relative">
      {/* Flecha izquierda */}
      {canLeft && (
        <button
          aria-label="Desplazar a la izquierda"
          onClick={() => scrollByCards("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 flex items-center justify-center"
        >
          ‹
        </button>
      )}

      {/* Carrusel */}
      <div
        ref={scrollerRef}
        className="overflow-x-auto no-scrollbar scroll-smooth"
      >
        <div className="flex gap-4 pr-2">
          {items.map((c) => (
            <div
              key={c.id}
              className="shrink-0"
              style={{ width: `min(260px, ${cardWidth}%)` }} // limita a 260px máx
            >
              <CategoryCard c={c as any} />
            </div>
          ))}
        </div>
      </div>

      {/* Flecha derecha */}
      {canRight && (
        <button
          aria-label="Desplazar a la derecha"
          onClick={() => scrollByCards("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 flex items-center justify-center"
        >
          ›
        </button>
      )}
    </div>
  );
}
