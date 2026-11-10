import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Charge, ChargeStatus } from '@/types/entities/charge';
import type { PagedResult } from '@/types/entities/paged-result';

export interface ListChargesParams {
  status?: ChargeStatus;
  pageNumber?: number;
  pageSize?: number;
}

export async function listCharges(params: ListChargesParams) {
  try {
    const { data } = await api.get<ApiResponse<PagedResult<Charge>>>('/charge', { params });
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCharges(params: Omit<ListChargesParams, 'pageNumber'>) {
  return useInfiniteQuery({
    queryKey: ['charges', 'list', params],
    queryFn: ({ pageParam }) => listCharges({ ...params, pageNumber: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber * lastPage.pageSize < lastPage.totalCount ? lastPage.pageNumber + 1 : undefined,
  });
}
