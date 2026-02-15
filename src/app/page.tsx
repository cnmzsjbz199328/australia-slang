"use client";

import { useEffect } from "react";
import Link from "next/link";
import SlangShowcase from "@/components/home/SlangShowcase";

export default function HomePage() {
  // Preload dictionary and quiz data in the background
  useEffect(() => {
    // Preload first page of slang dictionary
    fetch('/api/slang?page=1').catch(() => { });

    // Preload quiz data
    fetch('/api/quiz').catch(() => { });
  }, []);

  return (
    <div className="flex flex-col gap-8 py-8">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          Learn Australian Slang
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          From "G'day" to "Arvo", master the unique vocabulary of Down Under.
        </p>
      </section>

      <SlangShowcase />

      <section className="mt-8 flex justify-center gap-4">
        <Link
          href="/slang"
          className="rounded-full border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
        >
          View All Slang
        </Link>
        <Link
          href="/quiz"
          className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Take a Quiz
        </Link>
      </section>
    </div>
  );
}
