// src/server/usuarios/usuarios.service.ts
import { PrismaClient, Usuario, Rol, Prisma } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export type UserWithRole = Usuario & { roles: { rol: Rol }[] };

export async function getUsers(): Promise<UserWithRole[]> {
    return await prisma.usuario.findMany({
        include: {
            roles: {
                include: {
                    rol: true,
                },
            },
        },
    });
}

export async function getRoles(): Promise<Rol[]> {
    return await prisma.rol.findMany();
}

export async function createUser(data: Omit<UserWithRole, 'id' | 'fechaRegistro' | 'passwordHash' | 'roles'> & { password?: string, rolId?: number }): Promise<User> {
    const { password, rolId, ...userData } = data;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || "123456", salt);

    const createData: Prisma.UsuarioCreateInput = {
        ...userData,
        passwordHash,
    };

    if (rolId) {
        createData.roles = {
            create: {
                rolId: Number(rolId)
            }
        };
    }

    return await prisma.usuario.create({
        data: createData,
    });
}

export async function updateUser(id: number, data: Partial<Omit<UserWithRole, 'id' | 'fechaRegistro' | 'passwordHash' | 'roles'>> & { rolId?: number }): Promise<User> {
    const { rolId, ...userData } = data;

    const updateData: Prisma.UsuarioUpdateInput = {
        ...userData
    };

    if (rolId) {
        await prisma.usuarioRol.deleteMany({
            where: { usuarioId: id }
        });

        updateData.roles = {
            create: {
                rolId: Number(rolId)
            }
        };
    }

    return await prisma.usuario.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteUser(id: number): Promise<User> {
    return await prisma.usuario.update({
        where: { id },
        data: { activo: false },
    });
}