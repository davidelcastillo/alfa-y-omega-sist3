import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/server/usuarios/usuarios.service';
import { createUserSchema } from './schema';
import { ZodError } from 'zod';

export async function GET() {
    try {
        const users = await getUsers();
        return NextResponse.json({ ok: true, data: users });
    } catch (error) {
        const msg = (error as Error)?.message ?? 'Internal Error';
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = createUserSchema.parse(json);
    const nuevo = await createUser(data);
    return NextResponse.json({ ok: true, data: nuevo }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: err.issues }, { status: 422 });
    }
    const msg = (err as Error)?.message ?? 'Internal Error';
    const status = /no existe/i.test(msg) ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}