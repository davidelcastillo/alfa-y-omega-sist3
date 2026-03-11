// src/components/usuarios/StatsCards.tsx
"use client";

import { ClipboardList, CheckCircle2, CircleAlert } from "lucide-react";
import type { UserWithRole } from "@/server/usuarios/usuarios.service";

type Props = {
  users: UserWithRole[];
};

export default function StatsCards({ users }: Props) {
  const total = users.length;
  const activos = users.filter((u) => u.activo).length;
  const inactivos = total - activos;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card label="Total de Usuarios" value={total} gradient="from-pink-500 to-pink-300">
        <ClipboardList className="w-6 h-6 text-white" />
      </Card>

      <Card
        label="Usuarios Activos"
        value={activos}
        valueClass="text-green-600"
        gradient="from-green-400 to-green-600"
      >
        <CheckCircle2 className="w-6 h-6 text-white" />
      </Card>

      <Card
        label="Usuarios Inactivos"
        value={inactivos}
        valueClass="text-red-600"
        gradient="from-red-400 to-red-600"
      >
        <CircleAlert className="w-6 h-6 text-white" />
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
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
