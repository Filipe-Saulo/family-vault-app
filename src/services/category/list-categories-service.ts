import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
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
  try {
    const { data } = await api.get<ApiResponse<PagedResult<Category>>>('/category', { params });
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCategories(params: Omit<ListCategoriesParams, 'pageNumber'>) {
  return useInfiniteQuery({
    queryKey: ['categories', 'list', params],
    queryFn: ({ pageParam }) => listCategories({ ...params, pageNumber: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber * lastPage.pageSize < lastPage.totalCount ? lastPage.pageNumber + 1 : undefined,
  });
}
