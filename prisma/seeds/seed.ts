import { PrismaClient } from "../../src/generated/prisma";

const prisma = new PrismaClient();

async function seedCatalogos() {
  // ---- RUBROS ----
  const rubros = [
    "Materiales de Construcción Gruesa",
    "Construcción en Seco",
    "Techados y Zinguería",
    "Aberturas",
    "Pisos y Revestimientos",
    "Pinturería",
    "Sanitarios y Grifería",
    "Bulonería",
    "Ferretería y Electricidad",
    "Jardinería y Exterior",
  ];

  // ---- UNIDADES ----
  const unidades = [
    "Bolsa",
    "Metro cúbico (m³)",
    "Bolsón",
    "Unidad",
    "Pallet",
    "Barra/Tira",
    "Placa",
    "Tira",
    "Balde (kg)",
    "Rollo (m)",
    "Metro lineal",
    "Rollo (m²)",
    "Metro cuadrado (m²)",
    "Caja",
    "Lata/Balde (Litros)",
    "Hoja",
    "Juego",
    "Cien Unidades",
    "Kilo (kg)",
    "Metro",
    "Rollo",
    "Bolsa (dm³)",
  ];

  // ---- MARCAS ----
  const marcas = [
    "Loma Negra", "Holcim", "Cementos Avellaneda", "Acindar", "Tenaris",
    "Durlock", "Knauf", "Placo (Saint-Gobain)", "Mapei",
    "Icopal", "Sika", "Tejas del Plata", "AluZinc", "Montenegro",
    "Aluar", "Oblak", "Brodatz", "Zanotti",
    "Cerámica Scop", "Ilva", "Roca", "Krono Original",
    "Sherwin Williams", "Sinteplast", "Alba", "Plavicon",
    "Ferrum", "Peirano", "FV",
    "Oliver", "Gentili", "Premiumfast", "Clavos SA",
    "Bosch", "Tramontina", "Schneider Electric", "Philips",
    "Ideal", "Tricot", "Cestinci", "Patagonia Landscaping",
  ];

  // Opción rápida y eficiente: createMany + skipDuplicates (requiere @unique)
  await prisma.rubro.createMany({ data: rubros.map(nombre => ({ nombre })), skipDuplicates: true });
  await prisma.unidad.createMany({ data: unidades.map(nombre => ({ nombre })), skipDuplicates: true });
  await prisma.marca.createMany({ data: marcas.map(nombre => ({ nombre })), skipDuplicates: true });

  // (Alternativa equivalente con upsert si prefieres)
  // for (const nombre of rubros) { await prisma.rubro.upsert({ where: { nombre }, update: {}, create: { nombre } }); }
  // ... idem para unidades y marcas
}

async function demoProducto() {
  // Ejemplo práctico: crear un producto conectando por nombre (sin saber IDs)
  const rubro = await prisma.rubro.findUnique({ where: { nombre: "Materiales de Construcción Gruesa" } });
  const unidad = await prisma.unidad.findUnique({ where: { nombre: "Bolsa" } });
  const marca  = await prisma.marca.findUnique({ where: { nombre: "Loma Negra" } });

  if (!rubro || !unidad || !marca) {
    throw new Error("Faltan catálogos para el demo de Producto.");
  }

  await prisma.producto.create({
    data: {
      nombre: "Cemento Portland 50 kg",
      descripcion: "Cemento de alta resistencia",
      precioCompra: 3500,
      precioVenta: 4200,
      estado: true,
      rubro:  { connect: { id: rubro.id } },
      unidad: { connect: { id: unidad.id } },
      marca:  { connect: { id: marca.id } },
    },
  });
}

async function main() {
  await seedCatalogos();
  // (opcional) crea 1 producto de ejemplo
  // await demoProducto();
  console.log("Seed completado ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });