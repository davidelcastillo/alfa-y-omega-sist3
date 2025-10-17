export type Granularidad = "dia" | "mes";

export type DashboardPoint = {
    periodo: string;
    ingresos: number;
    egresos: number;
    resultado: number;
};

export type DashboardResumen = {
    desde: string;
    hasta: string;
    gran: Granularidad;
    totales: {
        ingresos: number;
        egresos: number;
        resultado: number;
        nuevosClientes: number;
        pedidosTotales: number;
    };
    series: DashboardPoint[];
};

export type ProductoMasVendido = {
    productoId: number;
    nombre: string;
    cantidadVendida: number;
};

export type AlertaStock = {
    productoId: number;
    nombre: string;
    sku: string | null;
    deposito: string;
    stockActual: number;
    stockMinimo: number;
};