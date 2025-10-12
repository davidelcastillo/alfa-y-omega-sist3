// app/comprobante-proveedor/[id]/page.tsx
import ComprobanteDetalleClient from "@/components/comprobante-proveedor/ComprobanteDetalle";

export default function Page({ params }: { params: { id: string } }) {
  return <ComprobanteDetalleClient id={params.id} />;
}