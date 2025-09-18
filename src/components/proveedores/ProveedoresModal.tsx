// components/proveedores/ProveedoresModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

type SupplierStatus = "Activo" | "Inactivo";
type SupplierType = "empresa" | "persona";
type CategoriaFiscal =
  | "Consumidor Final"
  | "Exento"
  | "Monotributista"
  | "Responsable Inscripto"
  | "Exterior"
  | "Mock";  //borrar esto luego que es para los mocks
  
  
export interface SupplierForm {
  id?: number;
  codigo: string;
  tipo: SupplierType;
  razonSocial?: string;
  nombreCompleto?: string;
  nombreFantasia?: string;
  genero?: string;
  //categoriaFiscal: CategoriaFiscal | "";
  categoriaFiscal: string | "";
  cuitCuil: string;
  pais: string;
  codigoPostal?: string;
  provincia?: string;
  localidad?: string;
  zona?: string;
  barrio?: string;
  telefono?: string;
  email?: string;
  paginaWeb?: string;
  estado?: SupplierStatus; // por defecto "Activo" al crear
}

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: SupplierForm | null;
  onClose: () => void;
  onSubmit: (payload: SupplierForm) => void;
};

const CUIT_REGEX = /^\d{2}-\d{8}-\d{1}$/;

const CATEGORIAS: CategoriaFiscal[] = [
  "Consumidor Final",
  "Exento",
  "Monotributista",
  "Responsable Inscripto",
  "Exterior",
  "Mock",
];

const PAISES = [
  "Argentina",
  "Brasil",
  "Chile",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "Perú",
  "Colombia",
  "Ecuador",
  "Venezuela",
  "Estados Unidos",
  "España",
];

const GENEROS = ["", "Masculino", "Femenino", "Otro", "Prefiero no decir"];

export default function ProveedoresModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SupplierForm>({
    codigo: "",
    tipo: "empresa",
    razonSocial: "",
    nombreCompleto: "",
    nombreFantasia: "",
    genero: "",
    categoriaFiscal: "",
    cuitCuil: "",
    pais: "Argentina",
    codigoPostal: "",
    provincia: "",
    localidad: "",
    zona: "",
    barrio: "",
    telefono: "",
    email: "",
    paginaWeb: "",
    estado: "Activo",
  });

  type CategoriaApi = { id: number; nombre: string }

  const [categorias, setCategorias] = useState<CategoriaApi[]>([])
  const [catsLoading, setCatsLoading] = useState(false)
  const [catsError, setCatsError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancel = false
    ;(async () => {
      try {
        setCatsLoading(true)
        setCatsError(null)
        const res = await fetch('/api/categorias-fiscales', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo cargar')
        if (!cancel) setCategorias(json.data as CategoriaApi[])
      } catch (e: any) {
        if (!cancel) setCatsError(e?.message ?? 'Error al cargar categorías')
      } finally {
        if (!cancel) setCatsLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [open])

  useEffect(() => {
    if (open) {
      console.log("👉 Modal abierto con initialData:", initialData);
      setStep(1);
      setForm((prev) => ({
        ...prev,
        ...(initialData ?? {}),
        estado: initialData?.estado ?? (mode === "create" ? "Activo" : prev.estado),
      }));
    }
  }, [open, initialData, mode]);

  const isEmpresa = form.tipo === "empresa";

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const set = <K extends keyof SupplierForm,>(key: K, val: SupplierForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const title = useMemo(
    () => (mode === "create" ? "Registrar Nuevo Proveedor" : "Editar Proveedor"),
    [mode]
  );

  function validateStep(s: number) {
    if (s === 1) {
      if (!form.codigo?.trim()) return warn("Código de Proveedor es obligatorio");
      if (isEmpresa) {
        if (!form.razonSocial?.trim()) return warn("Razón Social es obligatoria");
      } else {
        if (!form.nombreCompleto?.trim()) return warn("Nombre Completo es obligatorio");
      }
      return true;
    }
    if (s === 2) {
      if (!form.categoriaFiscal) return warn("Seleccioná la Categoría Fiscal");
      if (!CUIT_REGEX.test(form.cuitCuil ?? ""))
        return warn("CUIT/CUIL inválido (XX-XXXXXXXX-X)");
      return true;
    }
    if (s === 3) {
      // contacto/ubicación opcionales en base
      return true;
    }
    return true;
  }

  function warn(msg: string) {
    // Podés reemplazar por tu ToastNotification
    alert(msg);
    return false;
  }

  function formatCuitInput(raw: string) {
    let value = raw.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + "-" + value.slice(2);
    if (value.length >= 11) value = value.slice(0, 11) + "-" + value.slice(11, 12);
    return value;
  }

  const submit = () => {
    if (!validateStep(3)) return;
    onSubmit({
      ...form,
      estado: form.estado ?? "Activo",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
    {/* Overlay con blur */}
    <button
      aria-hidden
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm"
    />
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto modal-content">
        {/* Header */}
        <div
          className={`p-6 rounded-t-2xl ${
            mode === "create"
              ? "bg-gradient-to-r from-primary-pink to-light-pink"
              : "bg-gradient-to-r from-primary-blue to-dark-blue"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-8 py-6 bg-gray-50 border-b">
          <div className="flex items-center justify-center gap-4">
            {[
              { n: 1, label: "Datos Personales" },
              { n: 2, label: "Datos de Facturación" },
              { n: 3, label: "Datos de Contacto" },
            ].map(({ n, label }) => {
              const base =
                "step-indicator w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm";
              const cls =
                n < step ? "step-completed" : n === step ? "step-active" : "step-inactive";
              return (
                <div className="flex items-center" key={n}>
                  <div className={`${base} ${cls}`}>{n}</div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
                  {n !== 3 && <div className="w-12 h-0.5 bg-gray-300 ml-4" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Paso 1 */}
          {step === 1 && (
            <div className="form-section">
              <div className="section-header">
                <h4 className="text-xl font-bold text-dark-blue flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-primary-pink"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Datos Personales
                </h4>
                <p className="text-gray-600 mt-2">Información básica del proveedor</p>
              </div>

              {/* Tipo */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Tipo de Proveedor *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { v: "empresa", t: "Empresa", s: "Persona jurídica con razón social" },
                    { v: "persona", t: "Persona Física", s: "Persona individual" },
                  ].map((opt) => (
                    <label
                      key={opt.v}
                      className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="supplierType"
                        value={opt.v}
                        checked={form.tipo === opt.v}
                        onChange={() => set("tipo", opt.v as SupplierType)}
                        className="text-primary-pink focus:ring-primary-pink"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{opt.t}</div>
                        <div className="text-sm text-gray-600">{opt.s}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Razón Social (solo empresa) */}
                {isEmpresa && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Razón Social *
                    </label>
                    <Input
                      placeholder="Nombre legal de la empresa"
                      className="input-focus"
                      value={form.razonSocial ?? ""}
                      onChange={(e) => set("razonSocial", e.target.value)}
                    />
                  </div>
                )}

                {/* Nombre del Contacto / Nombre Completo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isEmpresa ? "Nombre del Contacto" : "Nombre Completo *"}
                  </label>
                  <Input
                    placeholder="Nombre completo"
                    className="input-focus"
                    value={form.nombreCompleto ?? ""}
                    onChange={(e) => set("nombreCompleto", e.target.value)}
                  />
                </div>

                {/* Nombre de Fantasía */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre de Fantasía
                  </label>
                  <Input
                    placeholder="Nombre comercial"
                    className="input-focus"
                    value={form.nombreFantasia ?? ""}
                    onChange={(e) => set("nombreFantasia", e.target.value)}
                  />
                </div>

                {/* Código de Proveedor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Código de Proveedor *
                  </label>
                  <Input
                    placeholder="Código único interno"
                    className="input-focus"
                    value={form.codigo}
                    onChange={(e) => set("codigo", e.target.value)}
                  />
                </div>

                {/* Género (solo persona) */}
                {!isEmpresa && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Género
                    </label>
                    <Select
                      className="input-focus"
                      value={form.genero ?? ""}
                      onChange={(e) => set("genero", e.target.value)}
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Paso 2 */}
          {step === 2 && (
            <div className="form-section">
              <div className="section-header">
                <h4 className="text-xl font-bold text-dark-blue flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-primary-pink"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  Datos de Facturación
                </h4>
                <p className="text-gray-600 mt-2">Información fiscal y tributaria</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Categoría Fiscal *
                  </label>
                  <Select
                    className="input-focus"
                    value={form.categoriaFiscal}
                    onChange={(e) =>
                      set("categoriaFiscal", e.target.value)}
                  >
                    <option value="">{catsLoading ? "Cargando..." : "Seleccionar categoría"}</option>
                      {catsError && (
                        <option disabled>⚠️ {catsError}</option>
                      )}

                    {categorias.length > 0
                      ? categorias.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.nombre}
                          </option>
                        ))
                      // Fallback si el endpoint todavía no devuelve nada:
                      : CATEGORIAS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    CUIT/CUIL *
                  </label>
                  <Input
                    className="input-focus"
                    placeholder="XX-XXXXXXXX-X"
                    maxLength={13}
                    value={form.cuitCuil}
                    onChange={(e) => set("cuitCuil", formatCuitInput(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: XX-XXXXXXXX-X
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3 */}
          {step === 3 && (
            <div className="form-section">
              <div className="section-header">
                <h4 className="text-xl font-bold text-dark-blue flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-primary-pink"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Datos de Contacto
                </h4>
                <p className="text-gray-600 mt-2">Información de ubicación y contacto</p>
              </div>

              <h5 className="text-lg font-semibold text-gray-800 mb-4">📍 Ubicación</h5>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    País *
                  </label>
                  <Select
                    className="input-focus"
                    value={form.pais}
                    onChange={(e) => set("pais", e.target.value)}
                  >
                    {PAISES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Código Postal
                  </label>
                  <Input
                    className="input-focus"
                    value={form.codigoPostal ?? ""}
                    onChange={(e) => set("codigoPostal", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Provincia
                  </label>
                  <Input
                    className="input-focus"
                    value={form.provincia ?? ""}
                    onChange={(e) => set("provincia", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Localidad
                  </label>
                  <Input
                    className="input-focus"
                    value={form.localidad ?? ""}
                    onChange={(e) => set("localidad", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Zona
                  </label>
                  <Input
                    className="input-focus"
                    value={form.zona ?? ""}
                    onChange={(e) => set("zona", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Barrio
                  </label>
                  <Input
                    className="input-focus"
                    value={form.barrio ?? ""}
                    onChange={(e) => set("barrio", e.target.value)}
                  />
                </div>
              </div>

              <h5 className="text-lg font-semibold text-gray-800 mb-4">📞 Contacto</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Teléfono / Celular
                  </label>
                  <Input
                    className="input-focus"
                    placeholder="+54 11 1234 5678"
                    value={form.telefono ?? ""}
                    onChange={(e) => set("telefono", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Correo Electrónico
                  </label>
                  <Input
                    className="input-focus"
                    type="email"
                    placeholder="contacto@empresa.com"
                    value={form.email ?? ""}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Página Web
                  </label>
                  <Input
                    className="input-focus"
                    type="url"
                    placeholder="https://www.empresa.com"
                    value={form.paginaWeb ?? ""}
                    onChange={(e) => set("paginaWeb", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              className={` ${step === 1 ? "invisible" : ""}`}
              onClick={prev}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </Button>

            <div className="flex gap-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                //className="bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:shadow-lg border-0"
                onClick={onClose}
              >
                Cancelar
              </Button>

              {step < 3 ? (
                <Button type="button" variant="primary" className="btn-primary text-white" onClick={next}>
                  Siguiente
                  <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button type="button" variant="primary" className="btn-primary text-white" onClick={submit}>
                  {mode === "create" ? "Registrar Proveedor" : "Guardar Cambios"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cierre al hacer click afuera */}
      <button className="fixed inset-0 -z-10" aria-hidden onClick={onClose} />
    </div>
        </div>

  );
}
