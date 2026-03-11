import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import type { Prisma } from "@/generated/prisma";
import { gestionStockQuerySchema } from "./schema";

type Dir = "asc" | "desc";

// Campos válidos para ordenar (todos existen en tu esquema actual)
const SORT_MAP = {
  stock:       (dir: Dir): Prisma.StockPorDepositoOrderByWithRelationInput => ({ stockActual: dir }),
  stockMinimo: (dir: Dir): Prisma.StockPorDepositoOrderByWithRelationInput => ({ stockMinimo: dir }),
  stockMaximo: (dir: Dir): Prisma.StockPorDepositoOrderByWithRelationInput => ({ stockMaximo: dir }),
  nombre:      (dir: Dir): Prisma.StockPorDepositoOrderByWithRelationInput => ({ producto: { nombre: dir } }),
} as const;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // 👇 Sanitizamos: si no hay depositId, lo ponemos como undefined
    const rawDepositId = url.searchParams.get("depositId");
    const safeDepositId =
      rawDepositId && rawDepositId.trim() !== "" ? rawDepositId : undefined;

    const parsed = gestionStockQuerySchema.parse({
      depositId: safeDepositId,                                // ✅
      status: url.searchParams.get("status") ?? "all",
      page: url.searchParams.get("page") ?? "1",
      pageSize: url.searchParams.get("pageSize") ?? "20",
      sort: url.searchParams.get("sort") ?? "nombre",
      dir: url.searchParams.get("dir") ?? "asc",
      q: url.searchParams.get("q") ?? undefined,
    });

    const { depositId, status, page, pageSize, sort, dir, q } = parsed;

    // where TIPADO (sin comparar columnas)
    const where: Prisma.StockPorDepositoWhereInput = {
      ...(depositId ? { depositoId: depositId } : {}),
      ...(q
        ? {
            producto: {
              OR: [
                { nombre: { contains: q, mode: "insensitive" } },
                { sku: { contains: q, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    };

    // orderBy TIPADO
    const orderBy = SORT_MAP[sort](dir);

    // Construyo el query y lo sello con "satisfies" para inferir payload
    const query = {
      where,
      include: {
        producto: { select: { id: true, nombre: true, sku: true } },
        deposito: { select: { id: true, nombre: true } },
      },
      orderBy,
    } satisfies Prisma.StockPorDepositoFindManyArgs;

    // Tipo de fila inferido del query (incluye producto y deposito)
    type StockRow = Prisma.StockPorDepositoGetPayload<typeof query>;

    const raw: StockRow[] = await prisma.stockPorDeposito.findMany(query);

    // status calculado en memoria (evita comparar columnas en Prisma)
    const computeStatus = (row: Pick<StockRow, "stockActual" | "stockMinimo" | "stockMaximo">) => {
      const { stockActual, stockMinimo, stockMaximo } = row;
      if (stockActual === 0) return "atZero" as const;
      if (stockMaximo != null && stockActual > stockMaximo) return "overMax" as const;
      if (stockMinimo > 0 && stockActual < stockMinimo) return "belowMin" as const;
      return "ok" as const;
    };

    const filtered = status === "all" ? raw : raw.filter((r) => computeStatus(r) === status);

    // paginación después de filtrar por status
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const rows = filtered.slice(start, end).map((r) => ({
      id: r.id,
      depositoId: r.depositoId,
      deposito: r.deposito?.nombre ?? "",
      productoId: r.productoId,
      producto: r.producto?.nombre ?? "",
      sku: r.producto?.sku ?? null,
      stock: r.stockActual,
      stockMinimo: r.stockMinimo,
      stockMaximo: r.stockMaximo,
      status: computeStatus(r),
    }));

    return NextResponse.json({ page, pageSize, total, rows });
  } catch (err) {
    console.error("[gestion-stock GET] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
