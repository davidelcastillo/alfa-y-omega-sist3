// src/mocks/eco/products.ts
export type ProductMock = {
  id: number
  name: string
  description?: string
  price: number
  imageUrl?: string
  brand?: string
  brandSlug?: string
  categorySlug?: string
  unit?: "unidad" | "par" | "kit" | "caja"
  slug: string
}

export const BEST_SELLERS: ProductMock[] = [
  { id: 1, name: "Auriculares Pro X", price: 79999, brand: "Genérica", slug: "auriculares-pro-x", imageUrl: "/images/eco/prodx.jpg" },
  { id: 2, name: "Teclado Mecánico 60%", price: 65999, brand: "Genérica", slug: "teclado-60", imageUrl: "/images/eco/teclado.jpg" },
  { id: 3, name: "Monitor 27” QHD", price: 299999, brand: "Vista", slug: "monitor-27-qhd", imageUrl: "/images/eco/monitor.jpg" },
  { id: 4, name: "Mouse Inalámbrico", price: 24999, brand: "Genérica", slug: "mouse-inalambrico", imageUrl: "/images/eco/mouse.jpg" },
]

export const PRODUCTS_ALL: ProductMock[] = [
  { id: 1, name: "Auriculares Pro X", description: "Sonido Hi-Res con cancelación activa",
    price: 79999, brand: "Genérica", brandSlug: "generica", categorySlug: "audio",
    unit: "par", slug: "auriculares-pro-x", imageUrl: "/images/eco/prodx.jpg" },
  { id: 2, name: "Teclado Mecánico 60%", description: "Switches rojos, RGB, cable USB-C",
    price: 65999, brand: "Genérica", brandSlug: "generica", categorySlug: "perifericos",
    unit: "unidad", slug: "teclado-60", imageUrl: "/images/eco/teclado.jpg" },
  { id: 3, name: "Monitor 27” QHD", description: "1440p, 75Hz, panel IPS",
    price: 299999, brand: "Vista", brandSlug: "vista", categorySlug: "monitores",
    unit: "unidad", slug: "monitor-27-qhd", imageUrl: "/images/eco/monitor.jpg" },
  { id: 4, name: "Mouse Inalámbrico", description: "2.4G + BT, 16000 DPI",
    price: 24999, brand: "Protek", brandSlug: "protek", categorySlug: "perifericos",
    unit: "unidad", slug: "mouse-inalambrico", imageUrl: "/images/eco/mouse.jpg" },
  { id: 5, name: "Kit Accesorios Escritorio", description: "Soporte, alfombrilla XL y hub",
    price: 45999, brand: "Genérica", brandSlug: "generica", categorySlug: "accesorios",
    unit: "kit", slug: "kit-accesorios", imageUrl: "/images/eco/kit.jpg" },
]
