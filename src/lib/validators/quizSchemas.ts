import { z } from "zod";

export const quizChoiceSchema = z.object({
  text: z.string().min(1, "choice text is required"),
  isCorrect: z.boolean().default(false),
});

export const createQuizQuestionInputSchema = z.object({
  question: z.string().min(1, "question is required"),
  explanation: z.string().optional(),
  slangId: z.string().optional(),
  choices: z.array(quizChoiceSchema).min(2, "at least 2 choices required"),
}).refine(
  (data) => data.choices.some((c) => c.isCorrect),
  { message: "at least one choice must be correct", path: ["choices"] }
);

export const updateQuizQuestionInputSchema = z.object({
  question: z.string().min(1).optional(),
  explanation: z.string().optional(),
  slangId: z.string().nullable().optional(),
  choices: z.array(quizChoiceSchema).min(2).optional(),
}).refine(
  (data) => !data.choices || data.choices.some((c) => c.isCorrect),
  { message: "at least one choice must be correct", path: ["choices"] }
);

export const submitQuizInputSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    choiceId: z.string(),
  })),
});

export type CreateQuizQuestionInput = z.infer<typeof createQuizQuestionInputSchema>;
export type UpdateQuizQuestionInput = z.infer<typeof updateQuizQuestionInputSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizInputSchema>;
