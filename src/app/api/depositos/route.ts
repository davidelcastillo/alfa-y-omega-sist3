import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const deps = await prisma.deposito.findMany({
    orderBy: { id: "desc" },
    take: 50,
  });
  return NextResponse.json({ ok: true, data: deps });
}
