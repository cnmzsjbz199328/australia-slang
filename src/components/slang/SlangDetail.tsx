export type SlangTermDetail = {
  id: string;
  phrase: string;
  meaning: string;
  example: string | null;
  createdAt: string;
};

interface SlangDetailProps {
  term: SlangTermDetail | null;
  loading?: boolean;
}

export default function SlangDetail({ term, loading }: SlangDetailProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="h-6 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    );
  }
  if (!term) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        Select a slang term to view details.
      </div>
    );
  }
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{term.phrase}</h2>
      <p className="mt-2 text-zinc-700 dark:text-zinc-300">{term.meaning}</p>
      {term.example && (
        <p className="mt-3 text-sm italic text-zinc-600 dark:text-zinc-400">
          Example: {term.example}
        </p>
      )}
    </article>
  );
}
