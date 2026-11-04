import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { CategoryRequestSchema } from '@/schemas/services/category/category-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Category } from '@/types/entities/category';

async function createCategory(payload: CategoryRequestSchema) {
  try {
    const { data } = await api.post<ApiResponse<Category>>('/category', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: createCategory,
  });
}
