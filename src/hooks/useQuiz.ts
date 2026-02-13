"use client";

import { useState, useCallback, useEffect } from "react";

export type QuizQuestion = {
  id: string;
  question: string;
  choices: { id: string; text: string }[];
};

export type QuizResult = {
  total: number;
  correct: number;
  details: Array<{
    questionId: string;
    correct: boolean;
    correctChoiceId: string | undefined;
    explanation: string | null;
  }>;
};

export function useQuiz(limit = 10) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const res = await fetch(`/api/quiz?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const selectAnswer = useCallback((questionId: string, choiceId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  }, []);

  const submit = useCallback(async () => {
    const answersList = Object.entries(answers).map(([questionId, choiceId]) => ({
      questionId,
      choiceId,
    }));
    if (answersList.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersList }),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      setResult(data);
    } finally {
      setSubmitting(false);
    }
  }, [answers]);

  return {
    questions,
    answers,
    result,
    loading,
    submitting,
    selectAnswer,
    submit,
    refetch: fetchQuestions,
  };
}
