import { prisma } from "@/lib/db";

export async function findRandomQuestions(limit: number) {
  const all = await prisma.quizQuestion.findMany({
    include: { choices: true },
    orderBy: { id: "asc" },
  });

  // Fisher-Yates shuffle for true randomization
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(limit, all.length));
}

export async function findQuizQuestionById(id: string) {
  return prisma.quizQuestion.findUnique({
    where: { id },
    include: { choices: true, slang: true },
  });
}

export async function findManyQuizQuestions(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.quizQuestion.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { slang: { select: { id: true, phrase: true } } },
    }),
    prisma.quizQuestion.count(),
  ]);
  return { items, total };
}

export async function createQuestionWithChoices(
  data: { question: string; explanation?: string | null; slangId?: string | null },
  choices: { text: string; isCorrect: boolean }[]
) {
  return prisma.quizQuestion.create({
    data: {
      question: data.question,
      explanation: data.explanation ?? null,
      slangId: data.slangId ?? null,
      choices: { create: choices },
    },
    include: { choices: true },
  });
}

export async function updateQuestionWithChoices(
  id: string,
  data: { question?: string; explanation?: string | null; slangId?: string | null },
  choices?: { text: string; isCorrect: boolean }[]
) {
  if (choices !== undefined) {
    await prisma.quizChoice.deleteMany({ where: { questionId: id } });
  }
  return prisma.quizQuestion.update({
    where: { id },
    data: {
      ...data,
      ...(choices !== undefined
        ? { choices: { create: choices } }
        : {}),
    },
    include: { choices: true },
  });
}

export async function deleteQuizQuestion(id: string) {
  return prisma.quizQuestion.delete({ where: { id } });
}

export async function getCorrectChoiceIdsByQuestionIds(questionIds: string[]) {
  const choices = await prisma.quizChoice.findMany({
    where: { questionId: { in: questionIds }, isCorrect: true },
    select: { questionId: true, id: true },
  });
  return new Map(choices.map((c) => [c.questionId, c.id]));
}
