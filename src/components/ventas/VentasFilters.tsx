"use client";

// Ya no necesitamos useState ni useEffect aquí
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export type FiltersState = {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  orderNumber?: string;
  status?: "" | "Enviado" | "Pendiente de enviar";
};

type VentasFiltersProps = {
  value: FiltersState; // Hacemos `value` obligatorio para un componente controlado
  loading?: boolean;
  onChange: (next: FiltersState) => void; // Hacemos `onChange` obligatorio
  onSearch?: (by: FiltersState) => void;
  onClear?: () => void;
};

export default function VentasFilters({
  value,
  loading,
  onChange,
  onSearch,
  onClear,
}: VentasFiltersProps) {
  // 1. Eliminamos el estado interno (useState) y el efecto de sincronización (useEffect).
  // El componente ahora es "tonto" y solo refleja las props que recibe.

  // 2. Simplificamos la función `update`.
  // Ahora, en lugar de manejar un estado interno, construye el nuevo estado
  // a partir del `value` actual y lo notifica al padre a través de `onChange`.
  function update<K extends keyof FiltersState>(k: K, v: FiltersState[K]) {
    // Creamos una copia del estado actual (que viene por props) y modificamos la clave necesaria.
    const nextState = { ...value, [k]: v };
    onChange(nextState); // Notificamos al padre del nuevo estado completo.
  }

  // 3. Simplificamos `handleClear`.
  // Simplemente llamamos a la función onClear que viene del padre.
  // El padre es responsable de resetear el estado.
  function handleClear() {
    onClear?.();
  }

  return (
    <div className="glass-effect rounded-2xl p-8 mb-8 card-hover bg-white/95 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Filtros de Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 4. Los inputs ahora usan `value` directamente desde las props */}
        <Input
          label="Fecha desde"
          type="date"
          value={value.from ?? ""}
          onChange={(e) => update("from", e.target.value)}
        />
        <Input
          label="Fecha hasta"
          type="date"
          value={value.to ?? ""}
          onChange={(e) => update("to", e.target.value)}
        />
        <Input
          label="Número de pedido"
          placeholder="Ej: PED-001"
          value={value.orderNumber ?? ""}
          onChange={(e) => update("orderNumber", e.target.value)}
        />
        <Select
          label="Estado"
          value={value.status ?? ""}
          onChange={(e) => update("status", e.target.value as FiltersState["status"])}
        >
          <option value="">Todos los estados</option>
          <option value="Enviado">Enviado</option>
          <option value="Pendiente de enviar">Pendiente de enviar</option>
        </Select>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handleClear} disabled={!!loading}>
          Limpiar Filtros
        </Button>
        <Button variant="azul" onClick={() => onSearch?.(value)} disabled={!!loading}>
          Buscar Pedidos
        </Button>
      </div>
    </div>
  );
}

