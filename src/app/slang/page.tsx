"use client";

import { useSlangSearch } from "@/hooks/useSlangSearch";
import SlangList from "@/components/slang/SlangList";
import SlangDetail from "@/components/slang/SlangDetail";
import Input from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";

export default function SlangPage() {
  const {
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
  } = useSlangSearch(1, 20);

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Slang Dictionary
      </h1>
      <Input
        label="Search"
        placeholder="Search by phrase or meaning..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <SlangList
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={loading}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </div>
        <div>
          <SlangDetail term={detail} loading={detailLoading} />
        </div>
      </div>
    </div>
  );
}
