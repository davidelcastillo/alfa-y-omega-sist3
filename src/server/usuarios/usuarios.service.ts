// src/server/usuarios/usuarios.service.ts
import { PrismaClient, Usuario } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export type User = Usuario;

export async function getUsers(): Promise<User[]> {
    return await prisma.usuario.findMany();
}

export async function createUser(data: Omit<User, 'id' | 'fechaRegistro' | 'passwordHash'> & { password?: string }): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password || "123456", salt);
    return await prisma.usuario.create({
        data: {
            ...data,
            passwordHash,
        },
    });
}

export async function updateUser(id: number, data: Partial<Omit<User, 'id' | 'fechaRegistro' | 'passwordHash'>> & { password?: string }): Promise<User> {
    const updateData: any = { ...data };

    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(data.password, salt);
        delete updateData.password;
    }

    return await prisma.usuario.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteUser(id: number): Promise<User> {
    return await prisma.usuario.delete({
        where: { id },
    });
}