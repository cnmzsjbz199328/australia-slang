import { z } from "zod";

export const createSlangInputSchema = z.object({
  phrase: z.string().min(1, "phrase is required"),
  meaning: z.string().min(1, "meaning is required"),
  example: z.string().optional(),
});

export const updateSlangInputSchema = createSlangInputSchema.partial();

export type CreateSlangInput = z.infer<typeof createSlangInputSchema>;
export type UpdateSlangInput = z.infer<typeof updateSlangInputSchema>;

export const slangListQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type SlangListQuery = z.infer<typeof slangListQuerySchema>;
