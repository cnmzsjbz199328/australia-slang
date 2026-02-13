"use client";

import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import type { SlangTermBrief } from "@/hooks/useSlangAdmin";

interface SlangAdminListProps {
  items: SlangTermBrief[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (id: string, data: { phrase: string; meaning: string; example?: string }) => void;
  onDelete: (id: string) => void;
}

export default function SlangAdminList({
  items,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onEdit,
  onDelete,
}: SlangAdminListProps) {
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
        No slang terms yet. Add one with the form above.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {items.map((term) => (
          <li
            key={term.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{term.phrase}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{term.meaning}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => onEdit(term.id, { phrase: term.phrase, meaning: term.meaning, example: term.example ?? undefined })}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => (window.confirm("Delete this term?") ? onDelete(term.id) : null)}
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
