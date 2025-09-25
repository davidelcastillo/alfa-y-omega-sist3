// Page principal de "Pagos a Proveedores" (Server Component)
// Pasa SOLO datos; la interactividad vive en PagosClient.
// ⚠️ Cuando haya API, reemplazar SOLO las líneas marcadas como // MOCK:

import PagosClient from './PagosClient';

// ===== MOCK: reemplazar por tu servicio real =====
import { supplierPaymentsMock, suppliersMock } from '@/mocks/pagos.mock';
// ================================================

export default function Page() {
  // ===== MOCK: reemplazar por await getPagosFromAPI() / getProveedoresLite() =====
  const initialData = supplierPaymentsMock;
  const suppliers   = suppliersMock.map((s) => ({ id: s.id, name: s.name }));
  // ==============================================================================

  return <PagosClient initialData={initialData} suppliers={suppliers} />;
}
