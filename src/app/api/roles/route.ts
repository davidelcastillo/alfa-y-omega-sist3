// src/app/api/roles/route.ts
import { NextResponse } from "next/server";
import { getRoles } from "@/server/usuarios/usuarios.service";

export async function GET() {
    const roles = await getRoles();
    return NextResponse.json(roles);
}