// src/lib/facturas/types.ts
import { Prisma , Deposito as PrismaDeposito } from '@/generated/prisma'; // Ajusta la ruta a tu cliente prisma

// 1. Tipo para la lista (tabla principal)
const facturaListItem = Prisma.validator<Prisma.ComprobanteClienteDefaultArgs>()({
  include: {
    usuario: { select: { nombre: true, apellido: true } },
    tipoComprobante: { select: { nombre: true } },
  },
});
export type Factura = Prisma.ComprobanteClienteGetPayload<typeof facturaListItem>;

// 2. Tipo para el detalle
const facturaDetail = Prisma.validator<Prisma.ComprobanteClienteDefaultArgs>()({
  include: {
    usuario: true,
    direccion: true,
    tipoComprobante: true,
    metodoPago: true,
    Deposito: true, 
    detalleComprobante: {
      include: {
        producto: { select: { nombre: true, sku: true } },
      },
    },
  },
});
export type FacturaDetail = Prisma.ComprobanteClienteGetPayload<typeof facturaDetail>;

// 3. Tipos para Stats y Filtros (similares a ventas)
export type Stats = {
  totalFacturas: number;
  facturasPagadas: number;
  facturasPendientes: number;
  totalFacturado: number;
};

export type FiltersState = {
  from?: string;
  to?: string;
  numeroComprobante?: string;
  estadoPago?: 'Pagado' | 'Pendiente' | '';
};
export type Deposito = PrismaDeposito;