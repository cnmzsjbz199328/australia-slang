/**
 * Build-time guard for the slang dataset. Run before build/test so malformed
 * data can never reach production. Zod is used here only — not in the app bundle.
 */
import { entries } from "../src/data";
import { slangDataSchema } from "../src/data/schema";

const result = slangDataSchema.safeParse(entries);
if (!result.success) {
  console.error("❌ Slang data validation failed:");
  console.error(result.error.issues.slice(0, 20));
  process.exit(1);
}

// Reject exact duplicates (same phrase AND meaning). Homonyms — the same phrase
// with a distinct meaning, e.g. "chippy" (chip shop) vs "chippy" (carpenter) —
// are allowed; collision-safe slugs keep their pages distinct.
const keys = entries.map((e) => `${e.phrase.toLowerCase()}|${e.meaning.toLowerCase()}`);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupes.length > 0) {
  const shown = [...new Set(dupes)].map((k) => k.split("|")[0]);
  console.error(`❌ Duplicate entries (same phrase + meaning): ${shown.join(", ")}`);
  process.exit(1);
}

console.log(`✅ Slang data valid: ${entries.length} entries, no exact duplicates.`);
