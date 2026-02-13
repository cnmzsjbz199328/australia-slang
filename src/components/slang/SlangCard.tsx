export type SlangTermBrief = {
  id: string;
  phrase: string;
  meaning: string;
  example: string | null;
};

interface SlangCardProps {
  term: SlangTermBrief;
  selected?: boolean;
  onSelect: () => void;
}

export default function SlangCard({ term, selected, onSelect }: SlangCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-4 text-left transition-colors ${
        selected
          ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800"
          : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
      }`}
    >
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{term.phrase}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{term.meaning}</p>
    </button>
  );
}
