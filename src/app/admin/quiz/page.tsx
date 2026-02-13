"use client";

import { useQuizAdmin, type CreateQuizInput, type UpdateQuizInput } from "@/hooks/useQuizAdmin";
import QuizAdminList from "@/components/admin/quiz/QuizAdminList";
import QuizAdminForm from "@/components/admin/quiz/QuizAdminForm";

export default function AdminQuizPage() {
  const {
    items,
    total,
    page,
    setPage,
    pageSize,
    loading,
    editingId,
    setEditingId,
    editDetail,
    create,
    update,
    remove,
  } = useQuizAdmin(1, 20);

  const handleCreate = async (data: CreateQuizInput | UpdateQuizInput) => {
    await create(data as CreateQuizInput);
  };

  const handleUpdate = async (data: UpdateQuizInput) => {
    if (editingId) await update(editingId, data);
  };

  const initialForEdit = editDetail
    ? {
        question: editDetail.question,
        explanation: editDetail.explanation ?? "",
        choices: editDetail.choices.map((c) => ({ text: c.text, isCorrect: c.isCorrect })),
      }
    : undefined;

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Manage Quiz</h1>
      <QuizAdminForm mode="create" onSubmit={handleCreate} />
      {editingId && initialForEdit && (
        <QuizAdminForm
          mode="edit"
          initial={initialForEdit}
          onSubmit={handleUpdate}
          onCancel={() => setEditingId(null)}
        />
      )}
      <QuizAdminList
        items={items}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        onPageChange={setPage}
        onEdit={setEditingId}
        onDelete={remove}
      />
    </div>
  );
}
