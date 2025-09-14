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
  codigo: string;
  tipo: SupplierType;
  razonSocial?: string;
  nombreCompleto?: string;
  nombreFantasia?: string;
  genero?: string;
  categoriaFiscal: CategoriaFiscal;
  cuitCuil: string;
  pais: string;
  codigoPostal?: string;
  provincia: string;
  localidad: string;
  zona?: string;
  barrio?: string;
  telefono?: string;
  email?: string;
  paginaWeb?: string;
  estado: SupplierStatus;
  fechaRegistro: string; // YYYY-MM-DD
}

export type FiltroEstado = "" | SupplierStatus;

export interface ProveedoresFiltersState {
  searchName: string;
  searchCode: string;
  status: FiltroEstado;
  category: "" | CategoriaFiscal;
}

export interface Stats {
  total: number;
  activos: number;
  inactivos: number;
}
