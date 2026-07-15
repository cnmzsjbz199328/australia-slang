import { z } from "zod";

// Shape of a single slang entry in the data-batch JSON files.
// Used for build-time validation (see scripts/validate-data.ts); not shipped to the client bundle.
export const quizChoiceSchema = z.object({
  text: z.string().min(1, "choice text is required"),
  isCorrect: z.boolean(),
});

export const quizSchema = z.object({
  question: z.string().min(1, "question is required"),
  explanation: z.string().nullable().optional(),
  choices: z
    .array(quizChoiceSchema)
    .min(2, "at least 2 choices required")
    .refine((c) => c.filter((x) => x.isCorrect).length === 1, {
      message: "exactly one choice must be correct",
    }),
});

export const slangEntrySchema = z.object({
  phrase: z.string().min(1, "phrase is required"),
  meaning: z.string().min(1, "meaning is required"),
  example: z.string().nullable().optional(),
  quiz: quizSchema,
});

export const slangDataSchema = z.array(slangEntrySchema);

export type SlangEntry = z.infer<typeof slangEntrySchema>;
