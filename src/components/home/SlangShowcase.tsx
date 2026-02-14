"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type SlangTermBrief } from "@/hooks/useSlangSearch";

export default function SlangShowcase() {
    const [terms, setTerms] = useState<SlangTermBrief[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fade, setFade] = useState(true); // Control fade state for transitions

    useEffect(() => {
        let mounted = true;
        async function fetchFeatured() {
            try {
                // Fetch a random page to get variety. 
                // Since we don't know total, we'll just fetch a larger page size (e.g. 10) from page 1 for now.
                // Ideally API supports random sorting, but for now this works.
                const res = await fetch("/api/slang?pageSize=10");
                if (!res.ok) return;
                const data = await res.json();
                if (mounted && data.items && data.items.length > 0) {
                    // Simple shuffle for variety on client
                    const shuffled = [...data.items].sort(() => 0.5 - Math.random());
                    setTerms(shuffled);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchFeatured();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (terms.length <= 1) return;
        const interval = setInterval(() => {
            setFade(false); // Start fade out
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % terms.length);
                setFade(true); // Start fade in
            }, 500); // Wait for fade out to complete (match duration-500)
        }, 5000); // 5 seconds per word

        return () => clearInterval(interval);
    }, [terms.length]);

    if (loading) {
        return <div className="h-64 animate-pulse rounded-xl bg-zinc-50 dark:bg-zinc-900/50" />;
    }

    if (terms.length === 0) return null;

    const term = terms[currentIndex];

    return (
        <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-white/50 px-4 py-12 text-center shadow-sm backdrop-blur-sm transition-all dark:border-zinc-800 dark:bg-zinc-900/30 sm:px-12">
            {/* Background decorative blob */}
            <div className={`absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-50'}`} />
            <div className={`absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-50'}`} />

            <div
                className={`flex flex-col items-center transition-all duration-700 ease-in-out ${fade ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
                    }`}
            >
                <div className="mb-6">
                    <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:bg-indigo-900/30 dark:text-indigo-400">
                        Daily Slang
                    </span>
                </div>

                <h2 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl">
                    {term.phrase}
                </h2>

                <p className="mt-6 max-w-2xl text-xl font-medium text-zinc-600 dark:text-zinc-300 sm:text-2xl">
                    {term.meaning}
                </p>

                {term.example && (
                    <div className="mt-6 border-l-2 border-indigo-500 pl-4 text-left">
                        <p className="text-lg italic text-zinc-500 dark:text-zinc-400">
                            "{term.example}"
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-12 flex items-center justify-center gap-2">
                {terms.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setFade(false);
                            setTimeout(() => {
                                setCurrentIndex(idx);
                                setFade(true);
                            }, 300);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                                : "w-1.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            <div className="mt-8 transition-opacity duration-700 delay-300">
                <Link
                    href="/slang"
                    className="group relative inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                >
                    Explore full dictionary
                    <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
