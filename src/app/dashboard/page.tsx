import DashboardClient from "./DashboardClient";

export default function Page() {
    const hoy = new Date();
    const d30 = new Date();
    d30.setDate(hoy.getDate() - 29);

    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    return (
        <DashboardClient
            initialDesde={toISO(d30)}
            initialHasta={toISO(hoy)}
            initialGran="dia"
        />
    );
}
