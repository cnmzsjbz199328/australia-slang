"use client";

import { useState, useCallback, useEffect } from "react";

export type QuizQuestionBrief = {
  id: string;
  question: string;
  explanation: string | null;
  slangId: string | null;
  slang?: { id: string; phrase: string } | null;
};

export type QuizQuestionDetail = QuizQuestionBrief & {
  choices: { id: string; text: string; isCorrect: boolean }[];
};

export type CreateQuizInput = {
  question: string;
  explanation?: string;
  slangId?: string;
  choices: { text: string; isCorrect: boolean }[];
};
export type UpdateQuizInput = {
  question?: string;
  explanation?: string | null;
  slangId?: string | null;
  choices?: { text: string; isCorrect: boolean }[];
};

export function useQuizAdmin(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [items, setItems] = useState<QuizQuestionBrief[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDetail, setEditDetail] = useState<QuizQuestionDetail | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        list: "1",
        page: String(page),
        pageSize: String(pageSize),
      });
      const res = await fetch(`/api/quiz?${params}`);
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

  useEffect(() => {
    if (!editingId) {
      setEditDetail(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/quiz/${editingId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setEditDetail(data);
      });
    return () => {
      cancelled = true;
    };
  }, [editingId]);

  const create = useCallback(async (input: CreateQuizInput) => {
    const res = await fetch("/api/quiz", {
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

  const update = useCallback(async (id: string, input: UpdateQuizInput) => {
    const res = await fetch(`/api/quiz/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to update");
    }
    setEditingId(null);
    setEditDetail(null);
    await fetchList();
  }, [fetchList]);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/quiz/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    if (editingId === id) {
      setEditingId(null);
      setEditDetail(null);
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
    editDetail,
    create,
    update,
    remove,
    refetch: fetchList,
  };
}
