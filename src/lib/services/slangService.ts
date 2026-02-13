import {
  createSlangInputSchema,
  updateSlangInputSchema,
  slangListQuerySchema,
  type CreateSlangInput,
  type UpdateSlangInput,
  type SlangListQuery,
} from "@/lib/validators/slangSchemas";
import * as slangRepo from "@/lib/repositories/slangRepository";
import { validationError, notFoundError, conflictError } from "@/lib/errors/AppError";

export type SearchSlangParams = SlangListQuery;

export async function searchSlang(params: SearchSlangParams) {
  const parsed = slangListQuerySchema.safeParse(params);
  if (!parsed.success) throw validationError(parsed.error.message);
  const { page, pageSize, q } = parsed.data;
  return slangRepo.findManySlang({ page, pageSize, q });
}

export async function getSlangById(id: string) {
  const term = await slangRepo.findSlangById(id);
  if (!term) throw notFoundError("Slang term not found");
  return term;
}

export async function createSlang(input: CreateSlangInput) {
  const parsed = createSlangInputSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error.message);
  const { phrase } = parsed.data;
  const existing = await slangRepo.findManySlang({ page: 1, pageSize: 1, q: phrase });
  if (existing.items.some((t) => t.phrase.toLowerCase() === phrase.toLowerCase())) {
    throw conflictError("A slang term with this phrase already exists");
  }
  return slangRepo.createSlang(parsed.data);
}

export async function updateSlang(id: string, input: UpdateSlangInput) {
  const parsed = updateSlangInputSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error.message);
  const existing = await slangRepo.findSlangById(id);
  if (!existing) throw notFoundError("Slang term not found");
  return slangRepo.updateSlang(id, parsed.data);
}

export async function deleteSlang(id: string) {
  const existing = await slangRepo.findSlangById(id);
  if (!existing) throw notFoundError("Slang term not found");
  return slangRepo.deleteSlang(id);
}
