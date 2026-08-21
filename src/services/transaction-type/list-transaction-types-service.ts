import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import type { ApiResponse } from '@/types/entities/api-response';
import type { TransactionType } from '@/types/entities/transaction-type';

async function listTransactionTypes(isActive?: boolean) {
  const { data } = await api.get<ApiResponse<TransactionType[]>>('/transactiontype', {
    params: { isActive },
  });
  return data.data;
}

export function useTransactionTypes(isActive?: boolean) {
  return useQuery({
    queryKey: ['transactionTypes', isActive],
    queryFn: () => listTransactionTypes(isActive),
  });
}
