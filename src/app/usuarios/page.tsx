// src/app/usuarios/page.tsx
import UsuariosClient from "./UsuariosClient";
import { getUsers, getRoles } from "@/server/usuarios/usuarios.service";
import AppShell from "@/components/layout/AppShell";
export const metadata = { title: 'Usuarios · ERP' }

export default async function Page() {
    const [users, roles] = await Promise.all([getUsers(), getRoles()]);

    return (
        <AppShell>
            <UsuariosClient users={users} roles={roles} />
        </AppShell>
    );
}