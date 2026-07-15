"use client";

import { useState, useCallback, useEffect } from "react";
import {
  pickRandomQuestions,
  scoreAnswers,
  type QuizQuestion,
  type QuizResult,
} from "@/lib/quiz";

export type { QuizQuestion, QuizResult } from "@/lib/quiz";

// Quiz state backed entirely by the static dataset — questions are drawn and
// scored in the browser, no API. Questions are picked on mount (client only) to
// avoid a server/client hydration mismatch from the random order.
export function useQuiz(limit = 10) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  const start = useCallback(() => {
    setResult(null);
    setAnswers({});
    setQuestions(pickRandomQuestions(limit));
    setLoading(false);
  }, [limit]);

  // Pick questions on mount, client-only: the random order must not run during
  // static prerender or it would mismatch on hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    start();
  }, [start]);

  const selectAnswer = useCallback((questionId: string, choiceId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  }, []);

  const submit = useCallback(() => {
    const list = Object.entries(answers).map(([questionId, choiceId]) => ({ questionId, choiceId }));
    if (list.length === 0) return;
    setResult(scoreAnswers(list));
  }, [answers]);

  return {
    questions,
    answers,
    result,
    loading,
    submitting: false,
    selectAnswer,
    submit,
    refetch: start,
  };
}
