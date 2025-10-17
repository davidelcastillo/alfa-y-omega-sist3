import { NextResponse } from "next/server";
import { updateUser, deleteUser } from "@/server/usuarios/usuarios.service";
import { ZodError } from "zod";
import { updateUserSchema } from "../schema";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = updateUserSchema.parse(body);

    const updatedUser = await updateUser(Number(params.id), data);

    return NextResponse.json({ ok: true, data: updatedUser });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ ok: false, error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Error al actualizar el usuario" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const updatedUser = await deleteUser(Number(params.id));
        return NextResponse.json({ ok: true, data: updatedUser });
    } catch (error) {
        const msg = (error as Error)?.message ?? 'Internal Error';
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
}