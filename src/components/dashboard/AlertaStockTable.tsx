type Props = {
    data: {
        nombre: string;
        sku: string | null;
        deposito: string;
        stockActual: number;
        stockMinimo: number;
    }[];
};

export default function AlertaStockTable({ data }: Props) {
    return (
        <div className="glass rounded-2xl p-6 h-[400px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Alerta de Stock Bajo</h3>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Producto</th>
                        <th scope="col" className="px-6 py-3">Depósito</th>
                        <th scope="col" className="px-6 py-3 text-right">Actual</th>
                        <th scope="col" className="px-6 py-3 text-right">Mínimo</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="bg-white border-b">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {item.nombre} <span className="text-gray-500">({item.sku || 'N/A'})</span>
                            </td>
                            <td className="px-6 py-4">{item.deposito}</td>
                            <td className="px-6 py-4 text-right font-bold text-red-600">{item.stockActual}</td>
                            <td className="px-6 py-4 text-right">{item.stockMinimo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}