"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import type { PurchaseOrder } from "@/lib/compras/purchase";

type Props = {
  order: PurchaseOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ComprasDetailDialog({ order, open, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-effect p-0 w-full max-w-4xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-pink to-light-pink px-6 py-5 flex items-start justify-between">
          <AlertDialogHeader className="space-y-1">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Detalle de la Orden de Compra
            </AlertDialogTitle>
            <p className="text-white/80">
              {order ? `OC #${order.id}` : "Selecciona una orden para ver sus detalles"}
            </p>
          </AlertDialogHeader>

          {order && (
            <Badge
              className={`text-white ${
                order.status === "Completa" ? "status-active" : "status-inactive"
              }`}
            >
              {order.status}
            </Badge>
          )}
        </div>

        <div className="px-6 py-6 space-y-8 max-h-[70vh] overflow-y-auto bg-white/95">
          {order ? (
            <>
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900">Información general</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Fecha de creación" value={order.creationDate} />
                  <DetailItem
                    label="Hora de creación"
                    value={order.creationTime ? `${order.creationTime} hs` : "—"}
                  />
                  <DetailItem
                    label="Depósito"
                    value={order.warehouse || "—"}
                  />
                  <DetailItem
                    label="Fecha de entrega"
                    value={order.deliveryDate || "—"}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900">Proveedor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Nombre" value={order.supplier.name} />
                  <DetailItem label="Código" value={order.supplier.code || "—"} />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-900">Productos</h3>
                  <span className="text-sm text-gray-500">
                    Cantidad total: {order.totalQuantity ?? 0}
                  </span>
                </div>

                {order.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Producto</th>
                          <th className="px-4 py-3 font-semibold">Cantidad</th>
                          <th className="px-4 py-3 font-semibold">Precio unitario</th>
                          <th className="px-4 py-3 font-semibold">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-gray-800">{item.productName}</td>
                            <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-gray-600">
                              ${formatMoney(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">
                              ${formatMoney(item.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 text-sm text-gray-500 rounded-xl border border-dashed border-gray-200">
                    Esta orden todavía no tiene productos asociados.
                  </div>
                )}
              </section>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard label="Total productos" value={`${order.items.length}`} />
                <SummaryCard label="Cantidad total" value={`${order.totalQuantity ?? 0}`} />
                <SummaryCard label="Monto total" value={`$${formatMoney(order.total)}`} />
              </section>
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Selecciona una orden para ver sus detalles.
            </div>
          )}
        </div>

        <AlertDialogFooter className="px-6 py-4 bg-white/90">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DetailItemProps = {
  label: string;
  value: string | number;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm">
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <p className="mt-2 text-lg font-semibold text-blue-900">{value}</p>
    </div>
  );
}

function formatMoney(value: number | undefined) {
  return (value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
