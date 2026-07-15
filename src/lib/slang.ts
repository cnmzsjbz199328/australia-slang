import { records } from "@/lib/dataset";

export type SlangTerm = {
  slug: string;
  phrase: string;
  meaning: string;
  example: string | null;
};

const terms: SlangTerm[] = records.map(({ slug, phrase, meaning, example }) => ({
  slug,
  phrase,
  meaning,
  example,
}));

export function getAllSlang(): SlangTerm[] {
  return terms;
}

export function getSlangBySlug(slug: string): SlangTerm | undefined {
  return terms.find((t) => t.slug === slug);
}

export type SlangSearchResult = {
  items: SlangTerm[];
  total: number;
  page: number;
  pageSize: number;
};

// Case-insensitive substring match on phrase or meaning, then paginate.
// Runs synchronously in the browser over the full dataset — no network round-trip.
export function searchSlang(query: string, page = 1, pageSize = 20): SlangSearchResult {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? terms.filter(
        (t) => t.phrase.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q)
      )
    : terms;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total, page, pageSize };
}
