// src/app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import { updateUser, deleteUser } from "@/server/usuarios/usuarios.service";

type Params = {
    id: string;
};

export async function PUT(request: Request, context: { params: Params }) {
    const { id } = context.params;
    const data = await request.json();
    const updatedUser = await updateUser(Number(id), data);
    return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request, context: { params: Params }) {
    const { id } = context.params;
    await deleteUser(Number(id));
    return new NextResponse(null, { status: 204 });
}