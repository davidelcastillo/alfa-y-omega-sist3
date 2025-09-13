import { prisma } from "@/lib/prisma";

export type ProveedoresQuery = {
  page?: number | string;
  limit?: number | string;
  search?: string;
  cuil?: string;
  razon_social?: string;
  categoria_fiscal?: string | number; // llega string, se castea a número
  provincia?: string;
  localidad?: string;
  sort?: string; // ej: "nombre:asc"
};

// Valores por defecto y límites
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Campos permitidos para ordenar la lista
const SORTABLE: Record<string, string> = {
  id: "id",
  codigo: "codigo",
  nombre: "nombre",
  nombreComercial: "nombreComercial",
  razonSocial: "razonSocial",
  cuil: "cuil",
  provincia: "provincia",
  localidad: "localidad",
  correoElectronico: "correoElectronico",
};

export async function listarProveedores(raw: ProveedoresQuery) {
  const page = Math.max(
    parseInt(String(raw.page ?? DEFAULT_PAGE), 10) || DEFAULT_PAGE,
    1
  );
  const limit = Math.min(
    Math.max(
      parseInt(String(raw.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT,
      1
    ),
    MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  const search = (raw.search ?? "").trim();
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: "insensitive" } },
      { nombreComercial: { contains: search, mode: "insensitive" } },
      { razonSocial: { contains: search, mode: "insensitive" } },
      { codigo: { contains: search, mode: "insensitive" } },
      { cuil: { contains: search, mode: "insensitive" } },
      { correoElectronico: { contains: search, mode: "insensitive" } },
      { telefono: { contains: search, mode: "insensitive" } },
      { provincia: { contains: search, mode: "insensitive" } },
      { localidad: { contains: search, mode: "insensitive" } },
      { barrio: { contains: search, mode: "insensitive" } },
      { codigoPostal: { contains: search, mode: "insensitive" } },
    ];
  }

  // filtros puntuales
  const cuil = raw.cuil;
  if (cuil) where.cuil = { contains: String(cuil), mode: "insensitive" };
  if (raw.razon_social)
    where.razonSocial = { contains: raw.razon_social, mode: "insensitive" };
  if (raw.provincia)
    where.provincia = { contains: raw.provincia, mode: "insensitive" };
  if (raw.localidad)
    where.localidad = { contains: raw.localidad, mode: "insensitive" };
  if (raw.categoria_fiscal !== undefined && raw.categoria_fiscal !== "") {
    const id = Number(raw.categoria_fiscal);
    if (!Number.isNaN(id)) where.categoriaFiscalId = id;
  }

  // orden
  let orderBy: any = { nombre: "asc" };
  if (raw.sort) {
    const [fieldRaw, dirRaw] = String(raw.sort).split(":");
    const field = SORTABLE[fieldRaw || ""] || "nombre";
    const dir = dirRaw === "desc" ? "desc" : "asc";
    orderBy = { [field]: dir };
  }

  const [total, data] = await Promise.all([
    prisma.proveedores.count({ where }),
    prisma.proveedores.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        codigo: true,
        nombre: true,
        nombreComercial: true,
        razonSocial: true,
        cuil: true,
        categoriaFiscalId: true,
        provincia: true,
        localidad: true,
        correoElectronico: true,
        telefono: true,
      },
    }),
  ]);

  return { ok: true, meta: { total, page, limit }, data };
}
