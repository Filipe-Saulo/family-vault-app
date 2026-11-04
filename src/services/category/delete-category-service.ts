import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';

async function deleteCategory(categoryId: number) {
  try {
    await api.delete<ApiResponse<null>>(`/category/${categoryId}`);
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: deleteCategory,
  });
}
