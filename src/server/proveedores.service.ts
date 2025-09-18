import { prisma } from "@/lib/prisma";
import type { CreateProveedorDTO } from '@/app/api/proveedores/schema';

// Crear un nuevo proveedor
export async function crearProveedor(dto: CreateProveedorDTO) {
  const cuil = dto.cuil ?? null; // ya viene normalizado desde Zod

  // Validar duplicado por CUIT/CUIL si vino
  if (cuil) {
    const existe = await prisma.proveedores.findFirst({
      where: { cuil },
      select: { id: true },
    });
    if (existe) throw new Error("CUIT ya registrado");
  }

  const creado = await prisma.proveedores.create({
    data: {
      nombre: dto.nombre,
      razonSocial: dto.razonSocial ?? null,
      nombreComercial: dto.nombreComercial ?? null,
      codigo: dto.codigo ?? null,
      genero: dto.genero ?? null,
      categoriaFiscalId: dto.categoriaFiscalId ?? null,
      cuil,
      pais: dto.pais ?? null,
      provincia: dto.provincia ?? null,
      localidad: dto.localidad ?? null,
      barrio: dto.barrio ?? null,
      codigoPostal: dto.codigoPostal ?? null,
      telefono: dto.telefono ?? null,
      paginaWeb: dto.paginaWeb ?? null,
      correoElectronico: dto.correoElectronico ?? null,
      estado: true, // <— asegura activo al crear
    },
    select: {
      id: true,
      codigo: true,
      nombre: true,
      nombreComercial: true,
      razonSocial: true,
      genero: true,
      cuil: true,
      categoriaFiscal: { select: { id: true, nombre: true } },
      provincia: true,
      localidad: true,
      pais: true,
      barrio: true,
      codigoPostal: true,
      telefono: true,
      paginaWeb: true,
      correoElectronico: true,
      estado: true,
    },
  });

  // 🔀 Mapear a alias consistentes con listar/actualizar
  return {
    id: creado.id,
    codigo: creado.codigo,
    tipo: creado.razonSocial ? "empresa" : "persona",
    razonSocial: creado.razonSocial,
    nombreCompleto: creado.nombre,
    nombreFantasia: creado.nombreComercial,
    genero: creado.genero,
    categoriaFiscal: creado.categoriaFiscal,
    cuitCuil: creado.cuil,
    pais: creado.pais,
    provincia: creado.provincia,
    localidad: creado.localidad,
    zona: null, // ⚠️ no existe en DB
    barrio: creado.barrio,
    codigoPostal: creado.codigoPostal,
    telefono: creado.telefono,
    email: creado.correoElectronico,
    paginaWeb: creado.paginaWeb,
    estado: creado.estado ? "Activo" : "Inactivo",
  };
}


// -------- LISTADO --------
export type ProveedoresQuery = {
  page?: number | string;
  limit?: number | string;
  search?: string;
  cuil?: string;
  razon_social?: string;
  categoria_fiscal?: string | number;
  provincia?: string;
  localidad?: string;
  sort?: string; // ej: "nombre:asc"
  status?: 'active' | 'inactive' | 'all' | string; // <— NUEVO
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

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
  estado: "estado", // <— opcional, por si querés ordenar por estado
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

  const where: Record<string, any> = {};
  const search = (raw.search ?? "").trim();

  // Filtro por estado (default active)
  const status = (raw.status ?? "active") as "active" | "inactive" | "all";
  if (status === "active") where.estado = true;
  else if (status === "inactive") where.estado = false;
  // 'all' => sin filtro

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

  // Filtros puntuales
  if (raw.cuil) where.cuil = { contains: String(raw.cuil), mode: "insensitive" };
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

  // Orden
  let orderBy: any = { nombre: "asc" };
  if (raw.sort) {
    const [fieldRaw, dirRaw] = String(raw.sort).split(":");
    const field = SORTABLE[fieldRaw || ""] || "nombre";
    const dir = dirRaw === "desc" ? "desc" : "asc";
    orderBy = { [field]: dir };
  }

  const [total, proveedores] = await Promise.all([
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
        genero: true,           // 🔀 agregado
        cuil: true,
        categoriaFiscal: {
          select: { id: true, nombre: true },
        },
        provincia: true,
        localidad: true,
        pais: true,
        barrio: true,           // 🔀 agregado
        codigoPostal: true,     // 🔀 agregado
        telefono: true,
        paginaWeb: true,        // 🔀 agregado
        correoElectronico: true,
        estado: true,
      },
    }),
  ]);

  // 🔀 Mapear a lo que espera el front (alias consistentes con actualizarProveedor)
  const data = proveedores.map((p) => ({
    id: p.id,
    codigo: p.codigo,
    tipo: p.razonSocial ? "empresa" : "persona",
    razonSocial: p.razonSocial,
    nombreCompleto: p.nombre,
    nombreFantasia: p.nombreComercial,
    genero: p.genero,
    categoriaFiscal: p.categoriaFiscal,
    cuitCuil: p.cuil,
    pais: p.pais,
    provincia: p.provincia,
    localidad: p.localidad,
    zona: null, // ⚠️ no existe en DB, podés eliminarlo luego del front
    barrio: p.barrio,
    codigoPostal: p.codigoPostal,
    telefono: p.telefono,
    email: p.correoElectronico,
    paginaWeb: p.paginaWeb,
    estado: p.estado ? "Activo" : "Inactivo",
  }));

  return { ok: true, meta: { total, page, limit, status }, data };
}



//modificar un proveedor

import type { UpdateProveedorDTO } from '@/app/api/proveedores/schema';

// Helper: arma un objeto sólo con campos presentes (sin pisar no enviados)
function pickDefined<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export async function actualizarProveedor(id: number, dto: UpdateProveedorDTO) {
  // Normalizar: si llega '' en campos con transform de Zod ya deberían ser null.
  // Chequeo de duplicado CUIL si vino en el payload
  if ("cuil" in dto && dto.cuil !== undefined) {
    const cuil = dto.cuil; // puede ser string | null
    if (cuil) {
      const dup = await prisma.proveedores.findFirst({
        where: { cuil, NOT: { id } },
        select: { id: true },
      });
      if (dup) throw new Error("CUIT ya registrado");
    }
  }

  // Construir "data" sólo con lo provisto
  const data = pickDefined({
    nombre: dto.nombre,
    razonSocial: dto.razonSocial ?? null,
    nombreComercial: dto.nombreComercial ?? null,
    codigo: dto.codigo ?? null,
    genero: dto.genero ?? null,
    categoriaFiscalId: dto.categoriaFiscalId ?? null,
    cuil: dto.cuil ?? null,
    pais: dto.pais ?? null,
    provincia: dto.provincia ?? null,
    localidad: dto.localidad ?? null,
    barrio: dto.barrio ?? null,
    codigoPostal: dto.codigoPostal ?? null,
    telefono: dto.telefono ?? null,
    paginaWeb: dto.paginaWeb ?? null,
    correoElectronico: dto.correoElectronico ?? null,
    estado: dto.estado, // opcional
  });

  // Si no hay nada para cambiar, devolvemos el actual
  if (Object.keys(data).length === 0) {
    const actual = await prisma.proveedores.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        nombreComercial: true,
        razonSocial: true,
        genero: true,              // 🔀 agregado
        cuil: true,
        categoriaFiscalId: true,
        provincia: true,
        localidad: true,
        pais: true,                // 🔀 agregado
        barrio: true,              // 🔀 agregado
        codigoPostal: true,        // 🔀 agregado
        telefono: true,
        paginaWeb: true,           // 🔀 agregado
        correoElectronico: true,
        estado: true,
        categoriaFiscal: { select: { id: true, nombre: true } }, // 🔀 agregado
      },
    });

    if (!actual) {
      const e: any = new Error("Not found");
      e.code = "P2025";
      throw e;
    }

    // 🔀 Mapeo agregado para devolver alias que espera el front
    return {
      id: actual.id,
      codigo: actual.codigo,
      tipo: actual.razonSocial ? "empresa" : "persona",
      razonSocial: actual.razonSocial,
      nombreCompleto: actual.nombre,
      nombreFantasia: actual.nombreComercial,
      genero: actual.genero,
      categoriaFiscal: actual.categoriaFiscal,
      cuitCuil: actual.cuil,
      pais: actual.pais,
      provincia: actual.provincia,
      localidad: actual.localidad,
      zona: null, // no existe en DB, lo podés dejar fijo o eliminar en el front
      barrio: actual.barrio,
      codigoPostal: actual.codigoPostal,
      telefono: actual.telefono,
      email: actual.correoElectronico,
      paginaWeb: actual.paginaWeb,
      estado: actual.estado ? "Activo" : "Inactivo",
    };
  }

  // Caso normal: aplicar update y devolver actualizado
  const actualizado = await prisma.proveedores.update({
    where: { id },
    data,
    select: {
      id: true,
      codigo: true,
      nombre: true,
      nombreComercial: true,
      razonSocial: true,
      genero: true,           
      cuil: true,
      categoriaFiscalId: true,
      provincia: true,
      localidad: true,
      pais: true,
      barrio: true,
      codigoPostal: true,
      telefono: true,
      paginaWeb: true,
      correoElectronico: true,
      estado: true,
      categoriaFiscal: { select: { id: true, nombre: true } },
    },
  });

  // 🔀 Mapeo agregado para devolver alias que espera el front
  return {
    id: actualizado.id,
    codigo: actualizado.codigo,
    tipo: actualizado.razonSocial ? "empresa" : "persona",
    razonSocial: actualizado.razonSocial,
    nombreCompleto: actualizado.nombre,
    nombreFantasia: actualizado.nombreComercial,
    genero: actualizado.genero,
    categoriaFiscal: actualizado.categoriaFiscal,
    cuitCuil: actualizado.cuil,
    pais: actualizado.pais,
    provincia: actualizado.provincia,
    localidad: actualizado.localidad,
    zona: null, // no existe en DB, lo podés dejar fijo o eliminar en el front
    barrio: actualizado.barrio,
    codigoPostal: actualizado.codigoPostal,
    telefono: actualizado.telefono,
    email: actualizado.correoElectronico,
    paginaWeb: actualizado.paginaWeb,
    estado: actualizado.estado ? "Activo" : "Inactivo",
  };
}
