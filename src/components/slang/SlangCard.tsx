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

export default function SlangCard({ term }: { term: SlangTermBrief }) {
  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{term.phrase}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{term.meaning}</p>
      {term.example && (
        <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-500">
          Example: {term.example}
        </p>
      )}
    </div>
  );
}
