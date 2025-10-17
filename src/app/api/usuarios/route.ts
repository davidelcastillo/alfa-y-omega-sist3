// src/app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { getUsers, createUser } from "@/server/usuarios/usuarios.service";

export async function GET() {
    const users = await getUsers();
    return NextResponse.json(users);
}

import { createUserSchema } from "./schema";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const validatedData = createUserSchema.parse(data);
        const newUser = await createUser(validatedData);
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json(error, { status: 400 });
    }
}