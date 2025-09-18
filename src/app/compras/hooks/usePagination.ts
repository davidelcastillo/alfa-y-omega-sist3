// src/app/compras/hooks/usePagination.ts
"use client";
import { useMemo, useState } from "react";

export default function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  function next() { setPage((p) => Math.min(totalPages, p + 1)); }
  function prev() { setPage((p) => Math.max(1, p - 1)); }
  function goto(n: number) { setPage(Math.min(Math.max(1, n), totalPages)); }
  function reset() { setPage(1); }

  return { page, setPage: goto, next, prev, reset, total, totalPages, pageItems, pageSize };
}
