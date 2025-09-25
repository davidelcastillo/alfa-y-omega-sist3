"use client";

import { useEffect, useMemo, useState } from "react";
import { apiDepositos } from "@/lib/deposito/api";
import { apiProveedores } from "@/lib/proveedores/api";
import { apiOCList, apiOCGet, apiOCCreate, apiOCAddItem } from "@/lib/compras/api";
import { apiProductosLite } from "@/lib/movimientos/api";
import { OrdenCompraCreateSchema, type OCListRow } from "@/lib/compras/types";

export default function Page() {
  // ---------- Estado UI
  const [depositos, setDepositos] = useState<{ id: number; nombre: string }[]>([]);
  const [proveedores, setProveedores] = useState<{ id: number; nombre: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  // Lista OC
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [estado, setEstado] = useState<string>("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<OCListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Detalle seleccionado
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<any>(null);

  // --- Agregar ítems: estado de búsqueda y formulario
  const [prodSearch, setProdSearch] = useState("");
  const [prodOptions, setProdOptions] = useState<{ id: number; nombre: string; rubro?: string | null; marca?: string | null; unidad?: string | null; }[]>([]);
  const [itemForm, setItemForm] = useState<{ productoId: number; cantidad: number; precioUnitario: string }>({ productoId: 0, cantidad: 1, precioUnitario: "" });

  // Form crear
  const tzNowLocalInput = useMemo(() => {
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzoffset).toISOString().slice(0, 16);
  }, []);
  const [form, setForm] = useState({
    fecha: "",
    proveedorId: 0,
    depositoId: "",
    nroOC: "",
    observaciones: "",
  });

  // ---------- Cargar catálogos al montar
  useEffect(() => {
    setForm((f) => ({ ...f, fecha: tzNowLocalInput }));
    Promise.all([apiDepositos(), apiProveedores()])
      .then(([deps, provs]) => {
        setDepositos(deps);
        setProveedores(provs);
      })
      .catch((e) => console.error(e));
  }, [tzNowLocalInput]);

  // ---------- Listado
  async function listar(q?: { page?: number }) {
    setLoading(true);
    try {
      const data = await apiOCList({
        page: q?.page ?? page,
        limit,
        sort: "desc",
        ...(search ? { search } : {}),
        ...(estado !== "" ? { estado: estado === "true" } : {}),
      });
      setRows(data.data);
      setTotal(data.total);
      setPages(data.pages);
      setPage(data.page);
    } catch (e: any) {
      console.error(e);
      setToast({ kind: "err", msg: e?.message ?? "Error al listar" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Detalle
  async function verDetalle(id: number) {
    setDetalleId(id);
    setLoading(true);
    try {
      const r = await apiOCGet(id);
      setDetalle(r.data);
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Error al obtener detalle" });
    } finally {
      setLoading(false);
    }
  }

  // --- Buscar productos (debounce simple)
  useEffect(() => {
    const q = prodSearch.trim();
    if (q.length < 2) { setProdOptions([]); return; }
    const t = setTimeout(async () => {
      try { setProdOptions(await apiProductosLite({ search: q, limit: 20 })); } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [prodSearch]);

  async function onAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!detalleId) return;
    const productoId = Number(itemForm.productoId);
    const cantidad = Number(itemForm.cantidad);
    const precioUnitario = Number(itemForm.precioUnitario);
    if (!productoId || cantidad <= 0 || !precioUnitario) {
      setToast({ kind: "err", msg: "Completá producto, cantidad y precio" });
      return;
    }
    try {
      await apiOCAddItem(detalleId, { productoId, cantidad, precioUnitario });
      setItemForm({ productoId: 0, cantidad: 1, precioUnitario: "" });
      setProdSearch("");
      setProdOptions([]);
      await verDetalle(detalleId);
      setToast({ kind: "ok", msg: "Ítem agregado" });
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "No se pudo agregar" });
    }
  }

  // ---------- Crear
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const dto = OrdenCompraCreateSchema.parse({
        fecha: new Date(form.fecha).toISOString(),
        proveedorId: Number(form.proveedorId),
        depositoId: form.depositoId ? Number(form.depositoId) : undefined,
        nroOC: form.nroOC || undefined,
        observaciones: form.observaciones || undefined,
      });
      const created: any = await apiOCCreate(dto);
      setToast({ kind: "ok", msg: `Creada #${created.id}` });
      setForm((f) => ({ ...f, nroOC: "", observaciones: "" }));
      await listar({ page: 1 });
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Error al crear" });
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Órdenes de Compra — Demo</h1>
        <button
          onClick={() => listar()}
          className="px-3 py-2 rounded-xl border shadow-sm hover:bg-gray-50"
        >
          {loading ? "..." : "Actualizar"}
        </button>
      </header>

      {/* Crear */}
      <section className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Crear OC</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600">Fecha</label>
              <input
                type="datetime-local"
                className="w-full border rounded-xl px-3 py-2"
                value={form.fecha}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Proveedor</label>
              <select
                className="w-full border rounded-xl px-3 py-2"
                value={form.proveedorId}
                onChange={(e) => setForm((f) => ({ ...f, proveedorId: Number(e.target.value) }))}
                required
              >
                <option value={0}>Seleccione…</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Depósito (opcional)</label>
              <select
                className="w-full border rounded-xl px-3 py-2"
                value={form.depositoId}
                onChange={(e) => setForm((f) => ({ ...f, depositoId: e.target.value }))}
              >
                <option value="">(Sin depósito)</option>
                {depositos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Nro OC (opcional)</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                placeholder="OC-0001"
                value={form.nroOC}
                onChange={(e) => setForm((f) => ({ ...f, nroOC: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Observaciones</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                placeholder="Notas…"
                value={form.observaciones}
                onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white">Crear</button>
            {toast && (
              <span
                className={`px-2.5 py-1 rounded-full text-sm ${
                  toast.kind === "ok"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {toast.msg}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Listado */}
      <section className="rounded-2xl border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end gap-3 mb-3">
          <div className="flex-1">
            <label className="text-sm text-gray-600">Búsqueda</label>
            <input
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Proveedor, nro OC, obs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Estado</label>
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Baja</option>
            </select>
          </div>
          <button
            className="px-3 py-2 rounded-xl border shadow-sm"
            onClick={() => {
              setPage(1);
              listar({ page: 1 });
            }}
          >
            Buscar
          </button>
        </div>

        {/* --- Agregar Ítem --- */}
            <form onSubmit={onAddItem} className="border rounded-2xl p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-2">
                  <input
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Buscar producto (mín. 2 letras)…"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                  />
                  {prodOptions.length > 0 && (
                    <select
                      className="w-full border rounded-xl px-3 py-2 mt-2"
                      value={itemForm.productoId}
                      onChange={(e) => setItemForm((f) => ({ ...f, productoId: Number(e.target.value) }))}
                    >
                      <option value={0}>Elegir producto…</option>
                      {prodOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Cantidad"
                    value={itemForm.cantidad}
                    onChange={(e) => setItemForm((f) => ({ ...f, cantidad: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Precio Unitario"
                    value={itemForm.precioUnitario}
                    onChange={(e) => setItemForm((f) => ({ ...f, precioUnitario: e.target.value }))}
                  />
                </div>
              </div>
              <div className="text-right">
                <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white">Agregar ítem</button>
              </div>
            </form>

            <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Proveedor</th>
                <th className="text-left p-2">Nro OC</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Ver</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{new Date(r.fecha).toLocaleString()}</td>
                  <td className="p-2">{r.proveedor?.nombre ?? "-"}</td>
                  <td className="p-2">{r.nroOC ?? "-"}</td>
                  <td className="p-2">{(r.total ?? 0).toFixed(2)}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        r.estado
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.estado ? "Activo" : "Baja"}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 rounded-lg border hover:bg-gray-50"
                      onClick={() => verDetalle(r.id)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <div>
            Página {page} / {pages} — Total: {total}
          </div>
          <div className="space-x-2">
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-40"
              onClick={() => {
                if (page > 1) listar({ page: page - 1 });
              }}
              disabled={page <= 1}
            >
              « Prev
            </button>
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-40"
              onClick={() => {
                if (page < pages) listar({ page: page + 1 });
              }}
              disabled={page >= pages}
            >
              Next »
            </button>
          </div>
        </div>
      </section>

      {/* Detalle */}
      <section className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Detalle</h2>
        {!detalleId ? (
          <p className="text-sm text-gray-600">Seleccione una OC de la lista…</p>
        ) : !detalle ? (
          <p className="text-sm text-gray-600">Cargando…</p>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold">OC #{detalle.id}</span>
              <span className="text-gray-600">{new Date(detalle.fecha).toLocaleString()}</span>
              <span className="px-2 py-0.5 rounded-full text-sm bg-gray-100">Items: {detalle.totales.items}</span>
              <span className="px-2 py-0.5 rounded-full text-sm bg-gray-100">Total: {detalle.totales.total_calc.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <div>Proveedor: <span className="font-medium">{detalle.proveedor?.nombre}</span></div>
              <div>Depósito: {detalle.deposito ? detalle.deposito.nombre : "-"}</div>
              <div>Obs: {detalle.observaciones ?? "-"}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2">Producto</th>
                    <th className="text-left p-2">Cant</th>
                    <th className="text-left p-2">P.Unit</th>
                    <th className="text-left p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.items.map((it: any, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{it.producto ?? it.productoId}</td>
                      <td className="p-2">{it.cantidad}</td>
                      <td className="p-2">{Number(it.precioUnitario).toFixed(2)}</td>
                      <td className="p-2">{Number(it.totalLinea).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
