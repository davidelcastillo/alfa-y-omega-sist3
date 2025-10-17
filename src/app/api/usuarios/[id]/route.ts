// src/app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import { updateUser, deleteUser } from "@/server/usuarios/usuarios.service";

type Params = {
    id: string;
};

import { updateUserSchema } from "../schema";

export async function PUT(request: Request, context: { params: Params }) {
    try {
        const id = Number(context.params.id);
        const data = await request.json();
        const validatedData = updateUserSchema.parse(data);
        const updatedUser = await updateUser(id, validatedData);
        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(error, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Params }) {
    const id = Number(context.params.id);
    const updatedUser = await deleteUser(id);
    return NextResponse.json(updatedUser);
}