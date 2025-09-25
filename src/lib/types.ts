export type UIProduct = {
  id: number
  nombre: string            
  descripcion?: string
  rubro: string
  marca: string
  unidad: string       
  estado: 'Activo' | 'Inactivo'
    // IDs para filtrar client-side sin otra llamada
  rubroId: number
  unidadId: number
  estadoBool: boolean
}
// exportación del SortOrder y SortKey para el ordenamiendo y agrupación 
export type SortOrder = 'asc' | 'desc' | null ;
export type SortKey = 'id' | 'nombre' | 'provincia' | 'ciudad' | 'ubicacion' | 'tipo' | 'capacidad' | 'itemsStock' | 'estado';
// lib/types.ts
import { z } from "zod";

export const IdSchema = z.number().int().positive();
export type Id = z.infer<typeof IdSchema>;

export const ISODateString = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Fecha inválida" });
