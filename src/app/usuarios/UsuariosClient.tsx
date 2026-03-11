'use client'

import React from "react";
import { useMemo, useState, useEffect } from 'react'
import { UserWithRole } from '@/server/usuarios/usuarios.service'
import { Rol } from '@/generated/prisma'
import StatsCards from '@/components/usuarios/StatsCards'
import Filters, { type UserFilters } from '@/components/usuarios/Filters'
import UsuarioModal, { Inputs as UserSubmit } from './UsuarioModal'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { SquarePen, UserCheck, UserX } from "lucide-react";

const PAGE_SIZE = 10;

export default function UsuariosClient({ users: initialUsers, roles }: { users: UserWithRole[], roles: Rol[] }) {
    const [users, setUsers] = useState<UserWithRole[]>(initialUsers);
    const [filters, setFilters] = useState<UserFilters>({ search: '', rolId: '', estado: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = (
                user.nombre.toLowerCase().includes(searchLower) ||
                user.apellido.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
            const matchesRol = !filters.rolId || (user.roles && user.roles[0]?.rol.id === Number(filters.rolId));
            const matchesEstado = !filters.estado || (filters.estado === 'Activo' && user.activo) || (filters.estado === 'Inactivo' && !user.activo);

            return matchesSearch && matchesRol && matchesEstado;
        });
    }, [users, filters]);

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleCreate = () => {
        setEditingUser(null);
        openModal();
    };

    const handleEdit = (user: UserWithRole) => {
        setEditingUser(user);
        openModal();
    };

    const handleSubmit = async (data: UserSubmit) => {
        try {
            const url = editingUser ? `/api/usuarios/${editingUser.id}` : '/api/usuarios';
            const method = editingUser ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.ok) {
                if (editingUser) {
                    setUsers(users.map(u => u.id === result.data.id ? result.data : u));
                } else {
                    setUsers([...users, result.data]);
                }
            } else {
                console.error("Error al guardar el usuario", result.error);
            }
            closeModal();
        } catch (error) {
            console.error("Error al guardar el usuario", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que quieres cambiar el estado de este usuario?")) {
            try {
                const response = await fetch(`/api/usuarios/${id}`, {
                    method: "DELETE",
                });
                const result = await response.json();
                if (result.ok) {
                    setUsers(users.map(u => u.id === result.data.id ? result.data : u));
                } else {
                    console.error("Error al cambiar el estado del usuario", result.error);
                }
            } catch (error) {
                console.error("Error al cambiar el estado del usuario", error);
            }
        }
    };

    return (
        <main className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-8 fade-in">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <span>Inicio</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-primary-pink font-medium">Gestión de Usuarios</span>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-pink to-primary-blue bg-clip-text text-transparent mb-2">
                        Gestión de Usuarios
                    </h2>
                    <p className="text-gray-600 text-lg">Administra y controla todos los usuarios del sistema</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 text-lg"
                >
                    <Plus className="w-6 h-6" />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            <StatsCards users={users} />
            <Filters roles={roles} value={filters} onChange={setFilters} />

            {/* === Tabla de Usuarios, estilo ComprasTable === */}
            <div className="glass-effect rounded-2xl overflow-hidden card-hover border">
            <div className="bg-gradient-to-r from-primary-pink to-light-pink p-6">
                <h3 className="text-xl font-bold text-white">Lista de Usuarios</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">Nombre</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">Email</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">Teléfono</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">Rol</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">Estado</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-blue-800">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedUsers.map((user: any, idx: number) => (
                    <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 text-gray-900 font-medium">
                        {user.nombre} {user.apellido}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-gray-700">{user.telefono || "-"}</td>
                        <td className="px-6 py-4 text-gray-700">
                        {user.roles?.[0]?.rol?.nombre ?? "Sin rol"}
                        </td>
                        <td className="px-6 py-4">
                        {user.activo ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            Activo
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            Inactivo
                            </span>
                        )}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex space-x-3">
                                {/* Editar */}
                                <button
                                type="button"
                                onClick={() => handleEdit(user)}
                                title="Editar usuario"
                                aria-label={`Editar ${user.nombre} ${user.apellido}`}
                                className="text-primary-blue hover:text-dark-blue transition-colors p-2 rounded-lg hover:bg-light-pink"
                                >
                                <SquarePen className="w-5 h-5" aria-hidden />
                                </button>

                                {/* Activar / Desactivar */}
                                {user.activo ? (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(user.id)}
                                    title="Desactivar usuario"
                                    aria-label={`Desactivar ${user.nombre} ${user.apellido}`}
                                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                                >
                                    <UserX className="w-5 h-5" aria-hidden />
                                </button>
                                ) : (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(user.id)}
                                    title="Activar usuario"
                                    aria-label={`Activar ${user.nombre} ${user.apellido}`}
                                    className="text-green-600 hover:text-green-700 transition-colors p-2 rounded-lg hover:bg-green-50"
                                >
                                    <UserCheck className="w-5 h-5" aria-hidden />
                                </button>
                                )}
                            </div>
                    </td>

                    </tr>
                    ))}

                    {paginatedUsers.length === 0 && (
                    <tr>
                        <td className="px-6 py-10 text-center text-gray-500" colSpan={6}>
                        No hay usuarios que coincidan con los filtros.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>

            {/* === Paginación, alineada a la estética === */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <p className="text-gray-600 font-medium">
                Mostrando{" "}
                <span className="font-bold text-primary-pink">
                {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredUsers.length)}
                </span>{" "}
                de{" "}
                <span className="font-bold text-primary-pink">{filteredUsers.length}</span> usuarios
            </p>

            <div className="flex items-center gap-2">
                <Button
                variant="outline"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page <= 1}
                >
                Anterior
                </Button>

                <span className="text-sm text-gray-700 px-2">
                Página <span className="font-semibold">{page}</span> de{" "}
                <span className="font-semibold">{totalPages}</span>
                </span>

                <Button
                variant="outline"
                onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                >
                Siguiente
                </Button>
            </div>
            </div>


            <UsuarioModal
                open={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                user={editingUser}
                roles={roles}
            />
        </main>
    );
}