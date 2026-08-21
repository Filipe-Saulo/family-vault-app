import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Category } from '@/types/entities/category';
import type { PagedResult } from '@/types/entities/paged-result';

export interface ListCategoriesParams {
  pageNumber?: number;
  pageSize?: number;
  description?: string;
  categoryPurposeId?: number;
}

async function listCategories(params: ListCategoriesParams) {
  const { data } = await api.get<ApiResponse<PagedResult<Category>>>('/category', { params });
  return data.data;
}

export function useCategories(params: ListCategoriesParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => listCategories(params),
  });
}
