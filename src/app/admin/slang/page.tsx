"use client";

import { useSlangAdmin, type CreateSlangInput, type UpdateSlangInput } from "@/hooks/useSlangAdmin";
import SlangAdminList from "@/components/admin/slang/SlangAdminList";
import SlangAdminForm from "@/components/admin/slang/SlangAdminForm";

export default function AdminSlangPage() {
  const {
    items,
    total,
    page,
    setPage,
    pageSize,
    loading,
    editingId,
    setEditingId,
    editData,
    setEditData,
    create,
    update,
    remove,
  } = useSlangAdmin(1, 20);

  const handleEdit = (id: string, data: { phrase: string; meaning: string; example?: string }) => {
    setEditingId(id);
    setEditData(data);
  };

  const handleCreate = async (data: CreateSlangInput | UpdateSlangInput) => {
    await create(data as CreateSlangInput);
  };

  const handleUpdate = async (data: CreateSlangInput | UpdateSlangInput) => {
    if (editingId) await update(editingId, data as UpdateSlangInput);
  };

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Manage Slang</h1>
      <SlangAdminForm
        mode="create"
        onSubmit={handleCreate}
      />
      {editingId && editData && (
        <SlangAdminForm
          mode="edit"
          initial={editData}
          onSubmit={handleUpdate}
          onCancel={() => {
            setEditingId(null);
            setEditData(null);
          }}
        />
      )}
      <SlangAdminList
        items={items}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={remove}
      />
    </div>
  );
}
