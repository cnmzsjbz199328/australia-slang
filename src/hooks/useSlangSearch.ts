"use client";

import { useMemo, useState } from "react";
import { searchSlang, type SlangTerm } from "@/lib/slang";

export type { SlangTerm } from "@/lib/slang";

// Client-side dictionary search over the full static dataset. Filtering is
// synchronous and instant, so there is no loading state and no debounce needed.
export function useSlangSearch(pageSize = 20) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const result = useMemo(() => searchSlang(query, page, pageSize), [query, page, pageSize]);

  const changeQuery = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const items: SlangTerm[] = result.items;

  return {
    query,
    setQuery: changeQuery,
    page,
    setPage,
    pageSize,
    items,
    total: result.total,
    loading: false,
  };
}
