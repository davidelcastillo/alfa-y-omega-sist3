// src/components/proveedores/StatsCards.tsx
'use client';

import { FC } from 'react';
import { Users2, CheckCircle2, XCircle } from 'lucide-react';

type StatsCardsProps = {
  total: number;
  activos: number;
  inactivos: number;
};

type Accent = 'pink' | 'green' | 'red';

const Card: FC<{
  title: string;
  value: number;
  accent?: Accent;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = ({ title, value, accent = 'pink', Icon }) => {
  const ring =
    accent === 'green'
      ? 'from-green-400 to-green-600'
      : accent === 'red'
      ? 'from-red-400 to-red-600'
      : 'from-primary-pink to-light-pink';

  const valueColor =
    accent === 'green'
      ? 'text-green-600'
      : accent === 'red'
      ? 'text-red-500'
      : 'text-dark-blue';

  return (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${ring} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" aria-hidden />
        </div>
      </div>
    </div>
  );
};

const StatsCards: FC<StatsCardsProps> = ({ total, activos, inactivos }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card title="Total Proveedores" value={total} accent="pink" Icon={Users2} />
      <Card title="Proveedores Activos" value={activos} accent="green" Icon={CheckCircle2} />
      <Card title="Proveedores Inactivos" value={inactivos} accent="red" Icon={XCircle} />
    </div>
  );
};

export default StatsCards;
