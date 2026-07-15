"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SlangTerm } from "@/lib/slang";

// Rotating hero that showcases featured slang terms. Data is passed in from the
// server (the dictionary itself), so there is no hardcoded duplicate list.
export default function SlangShowcase({ terms }: { terms: SlangTerm[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (terms.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % terms.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [terms.length]);

  if (terms.length === 0) return null;
  const term = terms[currentIndex];

  return (
    <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/20 px-4 py-12 text-center backdrop-blur-sm transition-all dark:bg-zinc-900/10 sm:px-12">
      <div className={`absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition-opacity duration-1000 ${fade ? "opacity-100" : "opacity-50"}`} />
      <div className={`absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl transition-opacity duration-1000 ${fade ? "opacity-100" : "opacity-50"}`} />

      <div
        className={`flex flex-col items-center transition-all duration-700 ease-in-out ${
          fade ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
        }`}
      >
        <Link
          href={`/slang/${term.slug}`}
          className="text-5xl font-extrabold tracking-tight text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400 sm:text-7xl"
        >
          {term.phrase}
        </Link>

        <p className="mt-6 max-w-2xl text-xl font-medium text-zinc-600 dark:text-zinc-300 sm:text-2xl">
          {term.meaning}
        </p>

        {term.example && (
          <div className="mt-6 border-l-2 border-indigo-500 pl-4 text-left">
            <p className="text-lg italic text-zinc-500 dark:text-zinc-400">
              &ldquo;{term.example}&rdquo;
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2">
        {terms.map((t, idx) => (
          <button
            key={t.slug}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentIndex(idx);
                setFade(true);
              }, 300);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                : "w-1.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            }`}
            aria-label={`Show ${t.phrase}`}
          />
        ))}
      </div>

      <div className="mt-8 transition-opacity duration-700 delay-300">
        <Link
          href="/slang"
          className="group relative inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
        >
          Explore full dictionary
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
