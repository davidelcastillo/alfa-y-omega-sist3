
"use client";
import { useState } from "react";
import type { SortKey, SortState } from "@/lib/comprobante-proveedor/comprobante";

export default function useComprobanteSort(initial: SortState = { key: "fecha", dir: "desc" }) {
  const [sort, setSort] = useState<SortState>(initial);

  function toggle(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  return { sort, setSort, toggle };
}
