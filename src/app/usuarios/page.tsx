// src/app/usuarios/page.tsx
import UsuariosClient from "./UsuariosClient";
import { getUsers } from "@/server/usuarios/usuarios.service";
import AppShell from "@/components/layout/AppShell";

export default async function Page() {
    const users = await getUsers();

    return (
        <AppShell>
            <UsuariosClient users={users} />
        </AppShell>
    );
}