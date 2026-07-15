import SlangCard from "./SlangCard";
import type { SlangTerm } from "@/lib/slang";

interface SlangListProps {
  items: SlangTerm[];
}

export default function SlangList({ items }: SlangListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
        No slang terms found. Try a different search.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((term) => (
        <li key={term.slug}>
          <SlangCard term={term} />
        </li>
      ))}
    </ul>
  );
}
