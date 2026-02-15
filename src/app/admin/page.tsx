import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Manage slang terms and quiz questions.
      </p>
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/slang"
          className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Manage Slang</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add, edit, or delete slang terms.
          </p>
        </Link>
        <Link
          href="/admin/quiz"
          className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Manage Quiz</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add, edit, or delete quiz questions and choices.
          </p>
        </Link>
      </section>
    </div>
  );
}
