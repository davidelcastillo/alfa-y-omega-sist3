// src/components/pagos/PagosStatsCards.tsx
// Estilo y UX alineado a ComprasStatsCards (Card reutilizable)
// • Pagos Completados = cantidad total de pagos
// • Monto total pagado = suma de todos los payment
// TODO: conectar API — pasar valores reales vía props

"use client";

import { CheckCircle2, CircleDollarSign } from "lucide-react";

type Props = {
  /** Cantidad total de pagos (registros) */
  totalPagos: number;
  /** Suma de todos los payment */
  totalPagado: number;
};

function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function PagosStatsCards({ totalPagos, totalPagado }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card label="Pagos Completados" value={totalPagos} gradient="from-pink-500 to-pink-300">
        <CheckCircle2 className="w-6 h-6 text-white" />
      </Card>

      <Card
        label="Monto total pagado"
        value={`$${money(totalPagado)}`}
        valueClass="text-green-700"
        gradient="from-blue-400 to-blue-600"
      >
        <CircleDollarSign className="w-6 h-6 text-white" />
      </Card>
    </div>
  );
}

function Card({
  label,
  value,
  valueClass = "text-blue-800",
  gradient,
  children,
}: {
  label: string;
  value: string | number;
  valueClass?: string;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-effect rounded-2xl p-6 card-hover bg-white/95 backdrop-blur-sm border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold ${valueClass ?? "text-blue-800"}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
          {children}
        </div>
      </div>
    </div>
  );
}
