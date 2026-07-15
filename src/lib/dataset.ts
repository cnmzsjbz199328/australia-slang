import { entries, type SlangEntry } from "@/data";

// A slang entry enriched with a stable, URL-safe slug derived from its phrase.
// Slugs double as quiz question ids so the dictionary and quiz stay in sync.
export type SlangRecord = {
  slug: string;
  phrase: string;
  meaning: string;
  example: string | null;
  quiz: SlangEntry["quiz"];
};

function slugify(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Assign collision-safe slugs once at module load.
export const records: SlangRecord[] = (() => {
  const seen = new Map<string, number>();
  return entries.map((e) => {
    const base = slugify(e.phrase) || "term";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;
    return {
      slug,
      phrase: e.phrase,
      meaning: e.meaning,
      example: e.example ?? null,
      quiz: e.quiz,
    };
  });
})();
