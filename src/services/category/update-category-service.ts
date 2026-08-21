import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/api';
import { AppError } from '@/errors/AppError';
import type { CategoryRequestSchema } from '@/schemas/services/category/category-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Category } from '@/types/entities/category';

async function updateCategory(categoryId: number, payload: CategoryRequestSchema) {
  try {
    const { data } = await api.put<ApiResponse<Category>>(`/category/${categoryId}`, payload);
    return data.data;
  } catch (error) {
    if (isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
      throw new AppError(error.response.data.message);
    }
    throw error;
  }
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: number; payload: CategoryRequestSchema }) =>
      updateCategory(categoryId, payload),
  });
}
