"use client";

import { useState, useEffect, useCallback } from "react";

export type SlangTermBrief = {
  id: string;
  phrase: string;
  meaning: string;
  example: string | null;
};

export type SlangTermDetail = SlangTermBrief & { createdAt: string };

export function useSlangSearch(initialPage = 1, initialPageSize = 20) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [items, setItems] = useState<SlangTermBrief[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SlangTermDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/slang?${params}`);
      if (!res.ok) throw new Error("Failed to fetch slang list");
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, query]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    fetch(`/api/slang/${selectedId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setDetail(data);
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  return {
    query,
    setQuery,
    page,
    setPage,
    pageSize,
    items,
    total,
    selectedId,
    setSelectedId,
    detail,
    loading,
    detailLoading,
    refetch: fetchList,
  };
}
