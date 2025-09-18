// src/app/compras/hooks/useComprasSort.ts
"use client";
import { useState } from "react";
import type { SortKey, SortState } from "@/lib/compras/purchase";

export default function useComprasSort(initial: SortState = { key: "creationDate", dir: "desc" }) {
  const [sort, setSort] = useState<SortState>(initial);

  function toggle(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  return { sort, setSort, toggle };
}
