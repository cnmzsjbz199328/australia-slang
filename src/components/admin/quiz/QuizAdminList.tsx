"use client";

import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import type { QuizQuestionBrief } from "@/hooks/useQuizAdmin";

interface QuizAdminListProps {
  items: QuizQuestionBrief[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function QuizAdminList({
  items,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onEdit,
  onDelete,
}: QuizAdminListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
        No quiz questions yet. Add one with the form above.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {items.map((q) => (
          <li
            key={q.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{q.question}</p>
              {q.slang?.phrase && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Slang: {q.slang.phrase}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onEdit(q.id)}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => (window.confirm("Delete this question?") ? onDelete(q.id) : null)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
    </div>
  );
}
