"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import type { CreateSlangInput, UpdateSlangInput } from "@/hooks/useSlangAdmin";

interface SlangAdminFormProps {
  mode: "create" | "edit";
  initial?: UpdateSlangInput;
  onSubmit: (data: CreateSlangInput | UpdateSlangInput) => Promise<void>;
  onCancel?: () => void;
}

export default function SlangAdminForm({
  mode,
  initial,
  onSubmit,
  onCancel,
}: SlangAdminFormProps) {
  const [phrase, setPhrase] = useState(initial?.phrase ?? "");
  const [meaning, setMeaning] = useState(initial?.meaning ?? "");
  const [example, setExample] = useState(initial?.example ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phrase.trim() || !meaning.trim()) {
      setError("Phrase and meaning are required.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "create") {
        await onSubmit({ phrase: phrase.trim(), meaning: meaning.trim(), example: example.trim() || undefined });
        setPhrase("");
        setMeaning("");
        setExample("");
      } else {
        await onSubmit({ phrase: phrase.trim(), meaning: meaning.trim(), example: example.trim() || undefined });
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
        {mode === "create" ? "Add slang term" : "Edit slang term"}
      </h3>
      <Input label="Phrase" value={phrase} onChange={(e) => setPhrase(e.target.value)} required />
      <Input label="Meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} required />
      <Input label="Example (optional)" value={example} onChange={(e) => setExample(e.target.value)} />
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
