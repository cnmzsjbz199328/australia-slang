"use client";

import { useState, useCallback, useEffect } from "react";

export type SlangTermBrief = {
  id: string;
  phrase: string;
  meaning: string;
  example: string | null;
};

export type SlangTermDetail = SlangTermBrief & { createdAt: string };

export type CreateSlangInput = { phrase: string; meaning: string; example?: string };
export type UpdateSlangInput = { phrase?: string; meaning?: string; example?: string };

export function useSlangAdmin(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [items, setItems] = useState<SlangTermBrief[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<UpdateSlangInput | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      const res = await fetch(`/api/slang?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const create = useCallback(async (input: CreateSlangInput) => {
    const res = await fetch("/api/slang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to create");
    }
    await fetchList();
  }, [fetchList]);

  const update = useCallback(async (id: string, input: UpdateSlangInput) => {
    const res = await fetch(`/api/slang/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to update");
    }
    setEditingId(null);
    setEditData(null);
    await fetchList();
  }, [fetchList]);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/slang/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    if (editingId === id) {
      setEditingId(null);
      setEditData(null);
    }
    await fetchList();
  }, [fetchList, editingId]);

  return {
    items,
    total,
    page,
    setPage,
    pageSize,
    loading,
    editingId,
    setEditingId,
    editData,
    setEditData,
    create,
    update,
    remove,
    refetch: fetchList,
  };
}
