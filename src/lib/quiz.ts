import { records } from "@/lib/dataset";

export type QuizChoice = { id: string; text: string };

export type QuizQuestion = {
  id: string;
  question: string;
  choices: QuizChoice[];
};

export type QuizAnswer = { questionId: string; choiceId: string };

export type QuizResultDetail = {
  questionId: string;
  correct: boolean;
  correctChoiceId: string | undefined;
  explanation: string | null;
};

export type QuizResult = {
  total: number;
  correct: number;
  details: QuizResultDetail[];
};

type BuiltQuestion = {
  question: QuizQuestion;
  correctChoiceId: string;
  explanation: string | null;
};

// Build one quiz question per slang record. Choice ids are derived from the
// question id so scoring needs no server: the answer key lives in the data.
const built: BuiltQuestion[] = records.map((r) => {
  const choices = r.quiz.choices.map((c, i) => ({ id: `${r.slug}-c${i}`, text: c.text }));
  const correctIndex = r.quiz.choices.findIndex((c) => c.isCorrect);
  return {
    question: { id: r.slug, question: r.quiz.question, choices },
    correctChoiceId: `${r.slug}-c${correctIndex}`,
    explanation: r.quiz.explanation ?? null,
  };
});

const byId = new Map(built.map((b) => [b.question.id, b]));

export function getAllQuestions(): QuizQuestion[] {
  return built.map((b) => b.question);
}

// Fisher-Yates shuffle over a copy; accepts an injectable rng for deterministic tests.
function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRandomQuestions(limit = 10, rng: () => number = Math.random): QuizQuestion[] {
  return shuffle(getAllQuestions(), rng).slice(0, Math.min(limit, built.length));
}

export function scoreAnswers(answers: QuizAnswer[]): QuizResult {
  let correct = 0;
  const details = answers.map((a) => {
    const b = byId.get(a.questionId);
    const correctChoiceId = b?.correctChoiceId;
    const ok = !!b && a.choiceId === correctChoiceId;
    if (ok) correct++;
    return {
      questionId: a.questionId,
      correct: ok,
      correctChoiceId,
      explanation: b?.explanation ?? null,
    };
  });
  return { total: answers.length, correct, details };
}
