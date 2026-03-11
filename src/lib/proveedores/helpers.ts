// /lib/proveedores/helpers.ts
import {
  ProveedoresFiltersState,
  Stats,
  Supplier,
  SupplierStatus,
} from "./types";

/** Normaliza texto para búsquedas: minúsculas + sin acentos */
export function normalize(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/** Formatea CUIT/CUIL mientras se escribe (XX-XXXXXXXX-X) */
export function formatCuitCuil(raw: string): string {
  let v = (raw || "").replace(/\D/g, "");
  if (v.length >= 2) v = v.slice(0, 2) + "-" + v.slice(2);
  if (v.length >= 11) v = v.slice(0, 11) + "-" + v.slice(11, 12);
  return v;
}

/** Valida CUIT/CUIL con regex + dígito verificador */
export function isValidCuitCuil(cuit: string): boolean {
  const clean = (cuit || "").replace(/\D/g, "");
  if (clean.length !== 11) return false;

  const base = clean.slice(0, 10).split("").map((n) => parseInt(n, 10));
  const dv = parseInt(clean.slice(10), 10);
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  const suma = base.reduce((acc, num, i) => acc + num * pesos[i], 0);
  const mod = suma % 11;
  const calc = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;

  return dv === calc;
}

/** Filtra proveedores con los criterios dados */
export function filterSuppliers(
  data: Supplier[],
  filters: ProveedoresFiltersState
): Supplier[] {
  const nameQuery = normalize(filters.searchName);
  const codeQuery = normalize(filters.searchCode);

  return data.filter((s) => {
    // blob de búsqueda por nombre / razón social / comercial / fantasia / completo
    const nameBlob = normalize(
      (s.razonSocial || "") +
      " " +
      (s.nombreCompleto || "") +
      " " +
      (s.nombreFantasia || "")
    );

    // blob de búsqueda por código
    const codeBlob = normalize(s.codigo ?? ""); // fallback vacío si es null

    // Filtro por nombre / razón social
    const okName = !nameQuery || nameBlob.includes(nameQuery);

    // Filtro por código
    const okCode = !codeQuery || codeBlob.includes(codeQuery);

    // ✅ Filtro por estado (Activo / Inactivo → ahora string, no boolean)
    const okStatus =
      !filters.status || s.estado === filters.status;

    // Filtro por categoría fiscal (comparación por id)
    const okCat =
      !filters.category ||
      String(s.categoriaFiscal?.id) === String(filters.category);

    return okName && okCode && okStatus && okCat;
  });
}

/** Estadísticas básicas */
export function computeStats(data: Supplier[]): Stats {
  const total = data.length;
  const activos = data.filter((d) => d.estado === "Activo").length;
  const inactivos = data.filter((d) => d.estado === "Inactivo").length;
  return { total, activos, inactivos };
}

/** ID incremental simple (si usás BD, reemplazar por ID real) */
export function nextSupplierId(arr: Supplier[]): number {
  return Math.max(0, ...arr.map((x) => x.id)) + 1;
}

/** Alterna estado activo/inactivo de un supplier */
export function toggleStatus(s: Supplier): Supplier {
  const nextEstado: "Activo" | "Inactivo" =
    s.estado === "Activo" ? "Inactivo" : "Activo";
  return { ...s, estado: nextEstado };
}
/** Ordena por fechaRegistro desc (YYYY-MM-DD) */
export function sortByFechaRegistroDesc(list: Supplier[]): Supplier[] {
  return [...list].sort((a, b) => (a.fechaRegistro! < b.fechaRegistro! ? 1 : -1));
}

/** Mini base CP -> ubicación (demo) */
export const POSTAL_CODE_DB: Record<
  string,
  { provincia: string; localidad: string; zona: string }
> = {
  "1000": { provincia: "Buenos Aires", localidad: "Capital Federal", zona: "Centro" },
  "1425": { provincia: "Buenos Aires", localidad: "Capital Federal", zona: "Norte" },
  "1640": { provincia: "Buenos Aires", localidad: "Martínez", zona: "Norte" },
  "2000": { provincia: "Santa Fe", localidad: "Rosario", zona: "Centro" },
  "5000": { provincia: "Córdoba", localidad: "Córdoba", zona: "Centro" },
  "4000": { provincia: "Tucumán", localidad: "San Miguel de Tucumán", zona: "Centro" },
  "3000": { provincia: "Santa Fe", localidad: "Santa Fe", zona: "Este" },
  "1900": { provincia: "Buenos Aires", localidad: "La Plata", zona: "Centro" },
};

/** Devuelve provincia/localidad/zona a partir del CP (si existe en el diccionario) */
export function fillFromPostalCode(
  codigoPostal?: string
): Partial<Pick<Supplier, "provincia" | "localidad" | "zona">> {
  if (!codigoPostal) return {};
  const hit = POSTAL_CODE_DB[codigoPostal];
  if (!hit) return {};
  return { provincia: hit.provincia, localidad: hit.localidad, zona: hit.zona };
}

// funcion para formatear el cuil
export function formatCuil(cuil: string): string {
  if (!cuil) return "";

  const numbers = cuil.replace(/\D/g, "");
  if (numbers.length !== 11) return cuil;

  return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`;
}
