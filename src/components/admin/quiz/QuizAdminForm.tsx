"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import type { CreateQuizInput, UpdateQuizInput } from "@/hooks/useQuizAdmin";

type ChoiceRow = { text: string; isCorrect: boolean };

interface QuizAdminFormProps {
  mode: "create" | "edit";
  initial?: { question: string; explanation?: string | null; choices: ChoiceRow[] };
  onSubmit: (data: CreateQuizInput | UpdateQuizInput) => Promise<void>;
  onCancel?: () => void;
}

export default function QuizAdminForm({
  mode,
  initial,
  onSubmit,
  onCancel,
}: QuizAdminFormProps) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [choices, setChoices] = useState<ChoiceRow[]>(
    initial?.choices?.length ? initial.choices : [{ text: "", isCorrect: false }, { text: "", isCorrect: true }]
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addChoice = () => setChoices((c) => [...c, { text: "", isCorrect: false }]);
  const removeChoice = (i: number) => setChoices((c) => c.filter((_, idx) => idx !== i));
  const updateChoice = (i: number, field: "text" | "isCorrect", value: string | boolean) => {
    setChoices((c) => c.map((ch, idx) => (idx === i ? { ...ch, [field]: value } : ch)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validChoices = choices.filter((ch) => ch.text.trim());
    if (!question.trim()) {
      setError("Question is required.");
      return;
    }
    if (validChoices.length < 2) {
      setError("At least 2 choices are required.");
      return;
    }
    if (!validChoices.some((ch) => ch.isCorrect)) {
      setError("At least one choice must be correct.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        question: question.trim(),
        explanation: explanation.trim() || undefined,
        choices: validChoices.map((ch) => ({ text: ch.text.trim(), isCorrect: ch.isCorrect })),
      };
      await onSubmit(payload);
      if (mode === "create") {
        setQuestion("");
        setExplanation("");
        setChoices([{ text: "", isCorrect: false }, { text: "", isCorrect: true }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
        {mode === "create" ? "Add quiz question" : "Edit quiz question"}
      </h3>
      <Input label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
      <Input label="Explanation (optional)" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Choices</label>
          <Button type="button" variant="ghost" onClick={addChoice}>
            Add choice
          </Button>
        </div>
        <ul className="space-y-2">
          {choices.map((ch, i) => (
            <li key={i} className="flex gap-2">
              <input
                type="text"
                value={ch.text}
                onChange={(e) => updateChoice(i, "text", e.target.value)}
                placeholder="Choice text"
                className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="correct"
                  checked={ch.isCorrect}
                  onChange={() => setChoices((c) => c.map((x, idx) => ({ ...x, isCorrect: idx === i })))}
                />
                Correct
              </label>
              <Button type="button" variant="ghost" onClick={() => removeChoice(i)} disabled={choices.length <= 2}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
