import {
    DashboardResumen,
    Granularidad,
    ProductoMasVendido,
    AlertaStock,
} from "./types";

const handleResponse = async (res: Response) => {
    const json = await res.json();
    if (!json.ok) throw new Error(json.error);
    return json.data;
};

export const apiGetDashboardResumen = async (
    q: { desde: string; hasta: string; gran: Granularidad }
): Promise<DashboardResumen> => {
    const params = new URLSearchParams(q);
    const res = await fetch(`/api/dashboard/resumen?${params.toString()}`);
    return handleResponse(res);
};

export const apiGetProductosMasVendidos = async (): Promise<ProductoMasVendido[]> => {
    const res = await fetch("/api/dashboard/productos-mas-vendidos");
    return handleResponse(res);
};

export const apiGetAlertaStock = async (): Promise<AlertaStock[]> => {
    const res = await fetch("/api/dashboard/alerta-stock");
    return handleResponse(res);
};