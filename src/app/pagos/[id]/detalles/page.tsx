// Page de Detalle (presentacional, sin hooks ni libs)
// ⚠️ Cuando tengan API, REEMPLAZAR SOLO LAS LÍNEAS marcadas.
'client'
import PagoDetail from '@/components/pagos/PagoDetail';
import { notFound } from 'next/navigation';

// ===== REEMPLAZAR SOLO ESTAS LÍNEAS CUANDO HAYA API =====
import { supplierPaymentsMock } from '@/mocks/pagos.mock';
// ========================================================

export default function PagoDetallePage({ params }: { params: { id: string } }) {
  // ===== REEMPLAZAR SOLO ESTAS LÍNEAS CUANDO HAYA API =====
  // Ej: const pago = await getPagoById(params.id);
  const pago = supplierPaymentsMock.find((p) => p.id === params.id);
  // ========================================================

  if (!pago) return notFound();

  return (
    <div className="p-6">
      <PagoDetail pago={pago} />
    </div>
  );
}
