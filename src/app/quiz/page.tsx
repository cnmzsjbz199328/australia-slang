"use client";

import { useQuiz } from "@/hooks/useQuiz";
import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizResultSummary from "@/components/quiz/QuizResultSummary";
import Button from "@/components/common/Button";

export default function QuizPage() {
  const {
    questions,
    answers,
    result,
    loading,
    submitting,
    selectAnswer,
    submit,
    refetch,
  } = useQuiz(10);

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-zinc-600 dark:text-zinc-400">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-8">
        <p className="text-zinc-600 dark:text-zinc-400">
          No quiz questions available. Add some in Admin.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6 py-6">
        <QuizResultSummary
          total={result.total}
          correct={result.correct}
          details={result.details}
        />
        <Button variant="secondary" onClick={refetch}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Quiz</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Select an answer for each question, then submit.
      </p>
      <ul className="space-y-6">
        {questions.map((q) => (
          <li key={q.id}>
            <QuizQuestionCard
              questionId={q.id}
              question={q.question}
              choices={q.choices}
              selectedChoiceId={answers[q.id] ?? null}
              onSelect={(choiceId) => selectAnswer(q.id, choiceId)}
              disabled={submitting}
            />
          </li>
        ))}
      </ul>
      <Button
        variant="primary"
        onClick={submit}
        disabled={submitting || Object.keys(answers).length < questions.length}
      >
        {submitting ? "Submitting..." : "Submit answers"}
      </Button>
    </div>
  );
}
