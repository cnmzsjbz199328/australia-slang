import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Australia Slang
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Browse Australian slang terms and test yourself with a short quiz.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/slang"
          className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Slang Dictionary
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Search and browse Australian slang terms with meanings and examples.
          </p>
        </Link>
        <Link
          href="/quiz"
          className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Quiz</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Take a short quiz to test your knowledge of Australian slang.
          </p>
        </Link>
      </section>
    </div>
  );
}
