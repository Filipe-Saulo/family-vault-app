import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { PagedResult } from '@/types/entities/paged-result';
import type { Transaction } from '@/types/entities/transaction';

export interface ListTransactionsParams {
  pageNumber?: number;
  pageSize?: number;
  userId?: string;
  categoryId?: number;
  transactionTypeId?: number;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

async function listTransactions(params: ListTransactionsParams) {
  try {
    const { data } = await api.get<ApiResponse<PagedResult<Transaction>>>('/transaction', { params });
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useTransactions(params: ListTransactionsParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => listTransactions(params),
    placeholderData: keepPreviousData,
  });
}
