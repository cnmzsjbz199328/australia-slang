export type ResultDetail = {
  questionId: string;
  correct: boolean;
  correctChoiceId: string | undefined;
  explanation: string | null;
};

interface QuizResultSummaryProps {
  total: number;
  correct: number;
  details: ResultDetail[];
}

export default function QuizResultSummary({ total, correct, details }: QuizResultSummaryProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Quiz Result</h3>
      <p className="mt-2 text-zinc-700 dark:text-zinc-300">
        You got {correct} out of {total} correct ({pct}%).
      </p>
      <ul className="mt-4 space-y-2">
        {details.map((d) => (
          <li
            key={d.questionId}
            className={`flex items-start gap-2 text-sm ${d.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            <span>{d.correct ? "✓" : "✗"}</span>
            {d.explanation && <span className="text-zinc-600 dark:text-zinc-400">{d.explanation}</span>}
            {!d.explanation && (d.correct ? "Correct" : "Incorrect")}
          </li>
        ))}
      </ul>
    </div>
  );
}
