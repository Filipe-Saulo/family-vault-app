import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { ChargeFailure } from '@/types/entities/charge';
import type { PagedResult } from '@/types/entities/paged-result';

export interface ListChargeFailuresParams {
  pageNumber?: number;
  pageSize?: number;
}

export async function listChargeFailures(params: ListChargeFailuresParams) {
  try {
    const { data } = await api.get<ApiResponse<PagedResult<ChargeFailure>>>('/charge/failures', { params });
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useChargeFailures(params: Omit<ListChargeFailuresParams, 'pageNumber'>) {
  return useInfiniteQuery({
    queryKey: ['charges', 'failures', params],
    queryFn: ({ pageParam }) => listChargeFailures({ ...params, pageNumber: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber * lastPage.pageSize < lastPage.totalCount ? lastPage.pageNumber + 1 : undefined,
  });
}
