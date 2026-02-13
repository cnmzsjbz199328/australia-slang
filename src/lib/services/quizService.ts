import {
  createQuizQuestionInputSchema,
  updateQuizQuestionInputSchema,
  submitQuizInputSchema,
  type CreateQuizQuestionInput,
  type UpdateQuizQuestionInput,
  type SubmitQuizInput,
} from "@/lib/validators/quizSchemas";
import * as quizRepo from "@/lib/repositories/quizRepository";
import { validationError, notFoundError } from "@/lib/errors/AppError";

const DEFAULT_QUIZ_LIMIT = 10;
const MAX_QUIZ_LIMIT = 50;

export async function getRandomQuestions(limit?: number) {
  const n = Math.min(limit ?? DEFAULT_QUIZ_LIMIT, MAX_QUIZ_LIMIT);
  const questions = await quizRepo.findRandomQuestions(n);
  return questions.map((q) => ({
    id: q.id,
    question: q.question,
    choices: q.choices.map((c) => ({ id: c.id, text: c.text })),
  }));
}

export async function getQuizQuestionById(id: string) {
  const q = await quizRepo.findQuizQuestionById(id);
  if (!q) throw notFoundError("Quiz question not found");
  return q;
}

export async function getQuizQuestionList(page: number, pageSize: number) {
  return quizRepo.findManyQuizQuestions(page, pageSize);
}

export async function createQuestion(input: CreateQuizQuestionInput) {
  const parsed = createQuizQuestionInputSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error.message);
  const { question, explanation, slangId, choices } = parsed.data;
  return quizRepo.createQuestionWithChoices(
    { question, explanation, slangId },
    choices
  );
}

export async function updateQuestion(id: string, input: UpdateQuizQuestionInput) {
  const parsed = updateQuizQuestionInputSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error.message);
  const existing = await quizRepo.findQuizQuestionById(id);
  if (!existing) throw notFoundError("Quiz question not found");
  const { question, explanation, slangId, choices } = parsed.data;
  return quizRepo.updateQuestionWithChoices(
    id,
    { question, explanation, slangId: slangId ?? undefined },
    choices
  );
}

export async function deleteQuestion(id: string) {
  const existing = await quizRepo.findQuizQuestionById(id);
  if (!existing) throw notFoundError("Quiz question not found");
  return quizRepo.deleteQuizQuestion(id);
}

export async function evaluateAnswers(input: SubmitQuizInput) {
  const parsed = submitQuizInputSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error.message);
  const { answers } = parsed.data;
  const questionIds = [...new Set(answers.map((a) => a.questionId))];
  const correctMap = await quizRepo.getCorrectChoiceIdsByQuestionIds(questionIds);
  const questions = await Promise.all(
    questionIds.map((id) => quizRepo.findQuizQuestionById(id))
  );
  const questionMap = new Map(questions.filter(Boolean).map((q) => [q!.id, q!]));

  let correct = 0;
  const details: Array<{
    questionId: string;
    correct: boolean;
    correctChoiceId: string | undefined;
    explanation: string | null;
  }> = [];

  for (const a of answers) {
    const correctChoiceId = correctMap.get(a.questionId);
    const ok = correctChoiceId === a.choiceId;
    if (ok) correct++;
    const q = questionMap.get(a.questionId);
    details.push({
      questionId: a.questionId,
      correct: ok,
      correctChoiceId,
      explanation: q?.explanation ?? null,
    });
  }

  return { total: answers.length, correct, details };
}
