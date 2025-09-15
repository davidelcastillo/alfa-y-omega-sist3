'use client';

import { FC } from 'react';
import Badge from '@/components/ui/Badge';

type Props = {
  total: number;
  ingresos: number;
  egresos: number;
};

const Card: FC<{ title: string; value: number; accent?: 'pink' | 'green' | 'red' }> = ({ title, value, accent = 'pink' }) => {
  const ring =
    accent === 'green' ? 'from-green-400 to-green-600' :
    accent === 'red'   ? 'from-red-400 to-red-600' :
                         'from-primary-pink to-light-pink';
  return (
    <div className="glass-effect rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${accent === 'green' ? 'text-green-600' : accent === 'red' ? 'text-red-500' : 'text-dark-blue'}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${ring} rounded-xl`} />
      </div>
    </div>
  );
};

const StatsCards: FC<Props> = ({ total, ingresos, egresos }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card title="Total Movimientos" value={total} />
      <Card title="Cantidad de Ingresos" value={ingresos} accent="green" />
      <Card title="Cantidad de Egresos" value={egresos} accent="red" />
    </div>
  );
};

export default StatsCards;
