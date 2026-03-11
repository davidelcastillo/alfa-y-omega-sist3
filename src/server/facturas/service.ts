// src/server/facturas.service.ts
import { prisma } from '@/lib/prisma'; // Ajusta la ruta a tu cliente prisma
import type { Factura, FacturaDetail, FiltersState } from '@/lib/facturas/types.ts';
import { Prisma } from '@/generated/prisma';


// Obtener la lista de facturas (para la tabla principal y API)
export async function listFacturas(
  filters: FiltersState
): Promise<Factura[]> {
  
  // Objeto base del 'where'
  const where: Prisma.ComprobanteClienteWhereInput = {};
  
  // --- INICIO DE LA CORRECCIÓN ---
  
  // 1. Crea un objeto de filtro de fecha separado
  const dateFilter: Prisma.DateTimeFilter = {};

  if (filters.from) {
    // 2. Asigna 'gte' directamente a este objeto
    dateFilter.gte = new Date(filters.from);
  }
  if (filters.to) {
    // 3. Asigna 'lte' directamente a este objeto
    // (Ya no se usa '...where.fecha')
    dateFilter.lte = new Date(filters.to);
  }
  
  // 4. Si el filtro de fecha tiene alguna propiedad, asígnalo a 'where.fecha'
  if (dateFilter.gte || dateFilter.lte) {
    where.fecha = dateFilter;
  }
  
  // --- FIN DE LA CORRECCIÓN ---

  if (filters.numeroComprobante) {
    // Asumiendo que numeroComprobante es Int, si es String, quita el parseInt
    where.numeroComprobante = parseInt(filters.numeroComprobante, 10);
  }
  if (filters.estadoPago) {
    where.saldo =
      filters.estadoPago === 'Pagado'
        ? 0
        : { gt: 0 };
  }

  return prisma.comprobanteCliente.findMany({
    where,
    include: {
      usuario: { select: { nombre: true, apellido: true } },
      tipoComprobante: { select: { nombre: true } },
    },
    orderBy: {
      fecha: 'desc',
    },
  });
}

// Obtener el detalle de UNA factura (para la página de detalles)
export async function getFacturaDetail(id: string): Promise<FacturaDetail | null> {
  return prisma.comprobanteCliente.findUnique({
    where: { id: parseInt(id, 10) }, // Asumiendo que el ID es numérico
    include: {
      usuario: true, // Datos completos del cliente
      direccion: true, // Datos de la dirección
      tipoComprobante: true, // Ej: "Factura A"
      metodoPago: true,
      Deposito: true,
      detalleComprobante: {
        include: {
          producto: { select: { nombre: true, sku: true } }, // Detalles del producto
        },
      },
    },
  });
}

// Para la carga inicial de la página (similar a getInitialVentasData)
export async function getInitialFacturasData() {
  const facturas = await listFacturas({});
  // Si necesitas depósitos para filtrar (ya que ComprobanteCliente tiene depositoId [cite: 65])
  const depositos = await prisma.deposito.findMany({
    where: { estado: true },
  });
  return { facturas, depositos };
}