// src/app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { getUsers, createUser } from "@/server/usuarios/usuarios.service";

export async function GET() {
    const users = await getUsers();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const data = await request.json();
    const newUser = await createUser(data);
    return NextResponse.json(newUser, { status: 201 });
}