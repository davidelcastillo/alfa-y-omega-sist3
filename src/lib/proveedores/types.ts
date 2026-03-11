// /lib/proveedores/types.ts

export type SupplierStatus = "Activo" | "Inactivo";
export type SupplierType = "empresa" | "persona";
export type CategoriaFiscal =
  | "Consumidor Final"
  | "Exento"
  | "Monotributista"
  | "Responsable Inscripto"
  | "Exterior";

export interface Supplier {
  id: number;

  codigo: string | null;              // Código interno del proveedor (puede ser null en BD)

  // Datos de identidad
  nombreCompleto: string | null;              // Nombre de persona física
  razonSocial: string | null;         // Razón social de empresa
  nombreFantasia: string | null;     // Nombre de fantasía / comercial
  genero?: string | null;             // Campo opcional, si lo usan en el futuro

  // Relación con Categoría Fiscal
  categoriaFiscalId: { id: number; nombre: string } | null;  // FK numérica (puede ser null)
  categoriaFiscal?: {                 // Relación expandida opcional
    id: number;
    nombre: string;
  } | null;

  // Identificación fiscal
  cuitCuil: string | null;                // CUIT/CUIL (string, puede ser null)

  // Ubicación
  pais: string | null;
  provincia: string | null;
  localidad: string | null;
  barrio?: string | null;
  codigoPostal?: string | null;
  zona?: string | null;               // este campo no está en BD, podés borrarlo si no lo usan

  // Contacto
  telefono?: string | null;
  email?: string | null;  // reemplaza a "email"
  paginaWeb?: string | null;

  // Estado en BD
  estado: "Activo" | "Inactivo";                 // true = Activo, false = Inactivo

  fechaRegistro: string;              // YYYY-MM-DD (lo mantenemos como tenías)
}
export type FiltroEstado = "" | "Activo" | "Inactivo";
//export type FiltroEstado = "" | SupplierStatus;

export interface ProveedoresFiltersState {
  searchName: string;
  searchCode: string;
  status:  "" | "Activo" | "Inactivo";
  category: string;
}

export interface Stats {
  total: number;
  activos: number;
  inactivos: number;
}
