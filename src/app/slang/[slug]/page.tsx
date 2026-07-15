import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlang, getSlangBySlug } from "@/lib/slang";

// Pre-render one static page per slang term at build time.
export function generateStaticParams() {
  return getAllSlang().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getSlangBySlug(slug);
  if (!term) return { title: "Not found" };
  const title = `${term.phrase} – Australian slang meaning`;
  const description = term.example
    ? `${term.phrase}: ${term.meaning}. Example: ${term.example}`
    : `${term.phrase}: ${term.meaning}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function SlangDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getSlangBySlug(slug);
  if (!term) notFound();

  return (
    <article className="mx-auto max-w-2xl py-8">
      <Link
        href="/slang"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to dictionary
      </Link>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        {term.phrase}
      </h1>
      <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">{term.meaning}</p>
      {term.example && (
        <blockquote className="mt-6 border-l-2 border-indigo-500 pl-4 text-lg italic text-zinc-500 dark:text-zinc-400">
          &ldquo;{term.example}&rdquo;
        </blockquote>
      )}
    </article>
  );
}
