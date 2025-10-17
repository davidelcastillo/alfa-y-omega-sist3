// src/app/usuarios/UsuariosClient.tsx
"use client";

import { useState } from "react";
import { User } from "@/server/usuarios/usuarios.service";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import UsuarioModal from "./UsuarioModal";

type Props = {
    users: User[];
};

export default function UsuariosClient({ users: initialUsers }: Props) {
    const [users, setUsers] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleCreate = () => {
        setEditingUser(null);
        openModal();
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        openModal();
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingUser) {
                const updatedUser = await fetch(`/api/usuarios/${editingUser.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }).then(res => res.json());
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            } else {
                const newUser = await fetch("/api/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }).then(res => res.json());
                setUsers([...users, newUser]);
            }
            closeModal();
        } catch (error) {
            console.error("Error al guardar el usuario", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            try {
                await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error("Error al eliminar el usuario", error);
            }
        }
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <span>Inicio</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-primary-pink font-medium">Gestión de Usuarios</span>
            </div>

            {/* Header de la sección */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
                        Gestión de Usuarios
                    </h2>
                    <p className="text-gray-600 text-lg">Administra y controla todos los usuarios</p>
                </div>
                <div className="flex space-x-4">
                    <Button
                        variant="primary"
                        size="lg"
                        className="px-8 py-8 rounded-xl gap-3 text-lg hover:shadow-lg"
                        onClick={handleCreate}
                    >
                        <Plus className="w-10 h-5 mr-2" aria-hidden />
                        Nuevo Usuario
                    </Button>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white border rounded-xl p-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Activo</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="p-4">{user.nombre} {user.apellido}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.telefono}</td>
                                <td className="p-4">{user.activo ? "Sí" : "No"}</td>
                                <td className="p-4 flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                        Editar
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UsuarioModal
                open={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                user={editingUser}
            />
        </>
    );
}