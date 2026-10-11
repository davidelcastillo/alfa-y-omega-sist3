// Page principal de "Pagos a Proveedores" (Server Component)
// Consume datos reales de la API de órdenes de pago

import PagosClient from './PagosClient';
import { apiListOrdenesPago } from '@/lib/ordenes-pago/api';
import { prisma } from '@/lib/prisma';
import { mapOrdenPagoToSupplierPayment } from '@/lib/ordenes-pago/mappers';

export default async function Page() {
  try {
    // 1. Obtener órdenes de pago desde la API
    const response = await apiListOrdenesPago({
      limit: 100, // Ajusta según necesites
      sort: '-fecha', // Más recientes primero
    });

    // 2. Obtener lista de proveedores activos para el filtro
    const proveedores = await prisma.proveedores.findMany({
      where: { estado: true },
      select: { 
        id: true, 
        nombre: true,
        codigo: true,
        correoElectronico: true,
        telefono: true,
      },
      orderBy: { nombre: 'asc' },
    });

    // 3. Mapear los datos de la API al formato que espera PagosClient
    const proveedoresById = new Map(proveedores.map((p) => [p.id, p]));
    const initialData = response.items.map((item) =>
      mapOrdenPagoToSupplierPayment(item, proveedoresById.get(item.proveedor.id))
    );

    return <PagosClient initialData={initialData} proveedores={proveedores} />;
  } catch (error) {
    console.error('Error al cargar órdenes de pago:', error);
    
    // En caso de error, mostrar página con datos vacíos
    return <PagosClient initialData={[]} proveedores={[]} />;
  }
}