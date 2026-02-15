"use client";

import { useSlangSearch } from "@/hooks/useSlangSearch";
import SlangList from "@/components/slang/SlangList";
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
    loading,
  } = useSlangSearch(1, 20);

  return (
    <div className="flex flex-col gap-6 py-6">
      <Input
        placeholder="Search by phrase or meaning..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />
      <div>
        <SlangList
          items={items}
          loading={loading}
        />
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
