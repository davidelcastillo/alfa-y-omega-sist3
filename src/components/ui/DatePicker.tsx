// src/components/movimientos/DatePicker.tsx
'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

function parseISODate(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  // Crear Date en zona local para evitar desfases por huso horario
  return new Date(y, m - 1, d);
}

function toISODateLocal(d: Date): string {
  // Construir YYYY-MM-DD tomando la fecha local
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  disabled = false,
}: {
  label: string;
  value?: string; // YYYY-MM-DD
  onChange: (iso: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const date = useMemo(() => parseISODate(value), [value]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}
          >
            {date ? format(date, 'dd/MM/yyyy', { locale: es }) : placeholder}
            <span className="opacity-60" aria-hidden>📅</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                onChange(toISODateLocal(d));
              }
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
