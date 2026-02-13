import Button from "./Button";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={!hasPrev} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
