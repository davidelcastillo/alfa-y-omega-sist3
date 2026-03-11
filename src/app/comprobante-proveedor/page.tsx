import ComprobanteClient from "./comprobanteClient"
import { listComprobanteAction } from "./actions/comprobante"
import type { ComprobanteProveedor } from "@/lib/comprobante-proveedor/comprobante"

export default async function Page() {
  let initialComprobantes: ComprobanteProveedor[] = []

  try {
    initialComprobantes = await listComprobanteAction()
  } catch (err) {
    console.error("Error listando comprobantes:", err)
  }

  return (
    <div className="p-2">
      <ComprobanteClient initialComprobantes={initialComprobantes} />
    </div>
  )
}
