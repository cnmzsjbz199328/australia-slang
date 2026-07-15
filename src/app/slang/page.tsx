"use client";

import { useSlangSearch } from "@/hooks/useSlangSearch";
import SlangList from "@/components/slang/SlangList";
import Input from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";

export default function SlangPage() {
  const { query, setQuery, page, setPage, pageSize, items, total } = useSlangSearch(20);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Slang Dictionary</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {total} Australian slang terms. Search by phrase or meaning.
        </p>
      </div>
      <Input
        placeholder="Search by phrase or meaning..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />
      <div>
        <SlangList items={items} />
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
}
