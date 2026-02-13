import { prisma } from "@/lib/db";
import type { CreateSlangInput, UpdateSlangInput } from "@/lib/validators/slangSchemas";

export type SlangListParams = { q?: string; page: number; pageSize: number };

export async function findManySlang(params: SlangListParams) {
  const { q, page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const where = q
    ? {
        OR: [
          { phrase: { contains: q, mode: "insensitive" as const } },
          { meaning: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.slangTerm.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
    prisma.slangTerm.count({ where }),
  ]);
  return { items, total };
}

export async function findSlangById(id: string) {
  return prisma.slangTerm.findUnique({ where: { id } });
}

export async function createSlang(data: CreateSlangInput) {
  return prisma.slangTerm.create({ data });
}

export async function updateSlang(id: string, data: UpdateSlangInput) {
  return prisma.slangTerm.update({ where: { id }, data });
}

export async function deleteSlang(id: string) {
  return prisma.slangTerm.delete({ where: { id } });
}
