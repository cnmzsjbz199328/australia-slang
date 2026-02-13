import SlangCard, { type SlangTermBrief } from "./SlangCard";

interface SlangListProps {
  items: SlangTermBrief[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export default function SlangList({ items, selectedId, onSelect, loading }: SlangListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    );
  }
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
        <li key={term.id}>
          <SlangCard
            term={term}
            selected={selectedId === term.id}
            onSelect={() => onSelect(term.id)}
          />
        </li>
      ))}
    </ul>
  );
}
