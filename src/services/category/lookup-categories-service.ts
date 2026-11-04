import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Category } from '@/types/entities/category';

async function lookupCategories() {
  try {
    const { data } = await api.get<ApiResponse<Category[]>>('/category/lookup');
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCategoriesLookup() {
  return useQuery({
    queryKey: ['categories', 'lookup'],
    queryFn: lookupCategories,
  });
}
