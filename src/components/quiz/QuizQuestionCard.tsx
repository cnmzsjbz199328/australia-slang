export type QuizChoice = { id: string; text: string };

interface QuizQuestionCardProps {
  questionId: string;
  question: string;
  choices: QuizChoice[];
  selectedChoiceId: string | null;
  onSelect: (choiceId: string) => void;
  disabled?: boolean;
}

export default function QuizQuestionCard({
  questionId,
  question,
  choices,
  selectedChoiceId,
  onSelect,
  disabled,
}: QuizQuestionCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-100">{question}</h3>
      <ul className="space-y-2" role="radiogroup" aria-label={`Answers for: ${question}`}>
        {choices.map((choice) => (
          <li key={choice.id}>
            <label className="flex cursor-pointer items-center gap-2 rounded border border-zinc-200 p-3 transition-colors has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-50 dark:border-zinc-700 has-[:checked]:dark:border-zinc-100 has-[:checked]:dark:bg-zinc-800">
              <input
                type="radio"
                name={questionId}
                value={choice.id}
                checked={selectedChoiceId === choice.id}
                onChange={() => onSelect(choice.id)}
                disabled={disabled}
                className="h-4 w-4"
              />
              <span className="text-zinc-700 dark:text-zinc-300">{choice.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
