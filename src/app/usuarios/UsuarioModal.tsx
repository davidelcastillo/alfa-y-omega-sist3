// src/app/usuarios/UsuarioModal.tsx
"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserWithRole } from "@/server/usuarios/usuarios.service";
import { Button } from "@/components/ui/Button";
import { Rol } from "@/generated/prisma";

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
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
            activo: true,
            rolId: roles[0]?.id,
        }
    });

    useEffect(() => {
        if (open && user) {
            setValue("nombre", user.nombre);
            setValue("apellido", user.apellido);
            setValue("email", user.email);
            setValue("telefono", user.telefono || "");
            setValue("activo", user.activo);
            setValue("rolId", user.roles[0]?.rol.id);
        } else if (open && !user) {
            reset();
        }
    }, [open, user, setValue, reset]);

    if (!open) return null;

    const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
        onSubmit(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{user ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input {...register("nombre", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            {errors.nombre && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input {...register("apellido", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            {errors.apellido && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" {...register("email", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        {errors.email && <span className="text-red-500 text-xs">Este campo es requerido</span>}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input {...register("telefono")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    {!user && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input type="password" {...register("password")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    )}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <select {...register("rolId")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            {roles.map(rol => (
                                <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="flex items-center">
                            <input type="checkbox" {...register("activo")} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                            <span className="ml-2 text-sm text-gray-700">Activo</span>
                        </label>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}