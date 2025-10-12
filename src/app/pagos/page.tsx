// Page principal de "Pagos a Proveedores" (Server Component)
// Consume datos reales de la API de órdenes de pago

import PagosClient from './PagosClient';
import { apiListOrdenesPago } from '@/lib/ordenes-pago/api';
import { prisma } from '@/lib/prisma';
import type { SupplierPayment } from '@/mocks/pagos.mock';

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
    const initialData: SupplierPayment[] = response.items.map((item) => {
      // Buscar datos completos del proveedor
      const proveedorCompleto = proveedores.find(p => p.id === item.proveedor.id);
      
      // Determinar el estado según la lógica de negocio
      let status: 'Pendiente de pago' | 'Pagado' | 'Vencido' = 'Pendiente de pago';
      if (!item.estado) {
        status = 'Vencido'; // Anulada se trata como vencida para la UI
      } else if (item.estado_pago === 'completo') {
        status = 'Pagado';
      } else if (item.estado_pago === 'parcial') {
        status = 'Pendiente de pago';
      }

      // Formatear fecha
      const fecha = new Date(item.fecha);
      const registrationDate = fecha.toISOString().replace('T', ' ').substring(0, 19);
      const dateOnly = fecha.toISOString().split('T')[0];

      return {
        id: item.id.toString(),
        paymentId: item.nro_interno || `PAG-${item.id.toString().padStart(3, '0')}`,
        registrationDate,
        invoiceCode: item.nro_interno || `OP-${item.id}`,
        purchaseOrderNumber: `OC-${item.id.toString().padStart(3, '0')}`,
        paymentDueDate: dateOnly,
        dueDate: dateOnly,
        supplier: {
          id: item.proveedor.id.toString(),
          name: item.proveedor.nombre,
          code: proveedorCompleto?.codigo || `PROV${item.proveedor.id.toString().padStart(3, '0')}`,
          email: proveedorCompleto?.correoElectronico || undefined,
          phone: proveedorCompleto?.telefono || undefined,
        },
        total: item.total_pagado,
        payment: item.estado_pago === 'completo' ? item.total_pagado : 0,
        balance: item.saldo_restante_total,
        comment: `${item.comprobantes_afectados} comprobante(s) afectado(s)`,
        status,
        paymentCompleteDate: item.estado_pago === 'completo' ? dateOnly : undefined,
        paymentMethod: (item.metodo_pago?.nombre as any) || 'Transferencia',
        voucherType: 'FAC',
        voucherNumber: item.nro_interno || `OP-${item.id}`,
        products: [],
        history: [
          {
            date: registrationDate.substring(0, 16),
            action: 'Orden de pago registrada',
            user: 'Sistema',
          },
        ],
        partialPayments: [],
      };
    });

    // 4. Mapear proveedores al formato esperado (para el filtro)
    const suppliers = proveedores.map((p) => ({
      id: p.id.toString(),
      name: p.nombre,
    }));

    return <PagosClient initialData={initialData} suppliers={suppliers} />;
  } catch (error) {
    console.error('Error al cargar órdenes de pago:', error);
    
    // En caso de error, mostrar página con datos vacíos
    return <PagosClient initialData={[]} suppliers={[]} />;
  }
}