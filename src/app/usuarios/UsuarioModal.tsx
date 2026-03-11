// src/app/usuarios/UsuarioModal.tsx
"use client";

import React from "react";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { UserWithRole } from "@/server/usuarios/usuarios.service";
import type { Rol } from "@/generated/prisma";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export type Inputs = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  activo: boolean;
  rolId: number;
  password?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Inputs) => void;
  user?: UserWithRole | null;
  roles: Rol[];
};

export default function UsuarioModal({ open, onClose, onSubmit, user, roles }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      activo: true,
      rolId: roles[0]?.id, // primer rol como default
    },
  });

  useEffect(() => {
    if (!open) return;
    if (user) {
      setValue("nombre", user.nombre);
      setValue("apellido", user.apellido);
      setValue("email", user.email);
      setValue("telefono", user.telefono || "");
      setValue("activo", user.activo);
      setValue("rolId", user.roles[0]?.rol.id);
    } else {
      reset({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        activo: true,
        rolId: roles[0]?.id,
        password: "",
      });
    }
  }, [open, user, setValue, reset, roles]);

  if (!open) return null;

  const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
    onSubmit(data);
    onClose();
  };

  const activo = watch("activo");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente y botón de cierre */}
        <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">
            {user ? "Editar Usuario" : "Nuevo Usuario"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2"
            aria-label="Cerrar"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre *"
                placeholder="Ej: Juan"
                {...register("nombre", { required: true })}
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-600">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Input
                label="Apellido *"
                placeholder="Ej: Pérez"
                {...register("apellido", { required: true })}
              />
              {errors.apellido && (
                <p className="mt-1 text-xs text-red-600">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Input
                type="email"
                label="Email *"
                placeholder="correo@empresa.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Input
                label="Teléfono"
                placeholder="Ej: +54 9 387 ..."
                {...register("telefono")}
              />
            </div>

            {!user && (
              <div className="md:col-span-2">
                <Input
                  type="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  {...register("password")}
                />
              </div>
            )}

            <div>
              <Select
                label="Rol *"
                {...register("rolId", { valueAsNumber: true })}
              >
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </Select>
            </div>

            {/* Switch / Checkbox Activo */}
            <div className="flex items-end">
              <label className="w-full">
                <span className="block text-sm font-medium text-gray-700 mb-2">Estado</span>
                <button
                  type="button"
                  onClick={() => setValue("activo", !activo)}
                  className={`w-full rounded-xl border transition-colors px-4 py-2 text-sm font-medium ${
                    activo
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  {activo ? "Activo" : "Inactivo"}
                </button>
                {/* checkbox real (accesibilidad / form state) */}
                <input type="checkbox" {...register("activo")} checked={activo} onChange={() => setValue("activo", !activo)} className="sr-only" />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onClose} className="px-8">
              Cancelar
            </Button>
            <Button type="submit" className="px-6">
              Guardar Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
