import Link from "next/link";
import type { SlangTerm } from "@/lib/slang";

export default function SlangCard({ term }: { term: SlangTerm }) {
  return (
    <Link
      href={`/slang/${term.slug}`}
      className="block w-full rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-700/50"
    >
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{term.phrase}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{term.meaning}</p>
      {term.example && (
        <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-500">
          Example: {term.example}
        </p>
      )}
    </Link>
  );
}
