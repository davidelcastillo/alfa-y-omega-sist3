import { ReactNode } from "react";

type Props = {
    title: string;
    value: string | number;
    icon: ReactNode;
    colorClass: string;
};

export default function KpiCard({ title, value, icon, colorClass }: Props) {
    return (
        <div className="glass rounded-2xl p-6 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}