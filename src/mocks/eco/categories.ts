// src/mocks/eco/categories.ts
export type CategoryMock = {
  id: number
  name: string
  slug: string
  icon?: string // opcional emoji/icono
}

export const CATEGORIES: CategoryMock[] = [
  { id: 1, name: "Audio", slug: "audio", icon: "🎧" },
  { id: 2, name: "Periféricos", slug: "perifericos", icon: "⌨️" },
  { id: 3, name: "Monitores", slug: "monitores", icon: "🖥️" },
  { id: 4, name: "Accesorios", slug: "accesorios", icon: "🧩" },
]
