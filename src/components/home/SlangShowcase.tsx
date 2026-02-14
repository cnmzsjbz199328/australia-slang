"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type SlangTermBrief } from "@/hooks/useSlangSearch";

export default function SlangShowcase() {
    const [term, setTerm] = useState<SlangTermBrief | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchFeatured() {
            try {
                const res = await fetch("/api/slang?pageSize=1");
                if (!res.ok) return;
                const data = await res.json();
                if (mounted && data.items && data.items.length > 0) {
                    // In a real "featured" API we might get a random one,
                    // for now just getting the first or a random page could work.
                    // Let's try to get a random page if we knew total, but for MVP 
                    // just taking the first item is fine, or we could fetch a few and rotate.
                    setTerm(data.items[0]);
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

    if (loading) {
        return <div className="h-48 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />;
    }

    if (!term) return null;

    return (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8 text-center transition-all dark:from-zinc-800 dark:to-zinc-900">
            <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-300">
                "{term.phrase}"
            </h2>
            <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">{term.meaning}</p>
            {term.example && (
                <p className="mt-4 text-base italic text-zinc-600 dark:text-zinc-400">
                    — {term.example}
                </p>
            )}
            <div className="mt-8">
                <Link
                    href="/slang"
                    className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    Explore Dictionary
                </Link>
            </div>
        </div>
    );
}
