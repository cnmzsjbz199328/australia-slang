import batch1 from "./data-batch-1-core.json";
import batch2 from "./data-batch-2-food.json";
import batch3 from "./data-batch-3-people.json";
import batch4 from "./data-batch-4-expressions.json";
import batch5 from "./data-batch-5-emotions.json";
import batch6 from "./data-batch-6-places.json";
import type { SlangEntry } from "./schema";

export type { SlangEntry } from "./schema";

// All slang entries, concatenated from the six data batches. This is the single
// source of truth for both the dictionary and the quiz — no database at runtime.
export const entries = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
  ...batch6,
] as SlangEntry[];
