// src/components/compras/ComprasStatsCards.tsx
import { CheckCircle2, XCircle, BadgeCheck, ClipboardList, CircleAlert, CircleDollarSign } from "lucide-react";


type Props = {
  total: number;
  completas: number;
  incompletas: number;
  montoTotal: number;
};

function money(n: number) {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function ComprasStatsCards({ total, completas, incompletas, montoTotal }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card label="Total Órdenes de Compra" value={total} gradient="from-pink-500 to-pink-300">
        <ClipboardList className="w-6 h-6 text-white" />
      </Card>
      <Card label="Órdenes Completas" value={completas} valueClass="text-green-600" gradient="from-green-400 to-green-600">
        <CheckCircle2 className="w-6 h-6 text-white" />
      </Card>
      <Card label="Órdenes Incompletas" value={incompletas} valueClass="text-yellow-600" gradient="from-yellow-400 to-yellow-600">
        <CircleAlert className="w-6 h-6 text-white" />
      </Card>
      <Card label="Total del Monto" value={`$${money(montoTotal)}`} gradient="from-blue-400 to-blue-600">
        <CircleDollarSign className="w-6 h-6 text-white" />
      </Card>
    </div>
  );
}

function Card({
  label,
  value,
  valueClass,
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
