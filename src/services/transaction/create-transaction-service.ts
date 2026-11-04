import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { CreateTransactionRequestSchema } from '@/schemas/services/transaction/create-transaction-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Transaction } from '@/types/entities/transaction';

async function createTransaction(payload: CreateTransactionRequestSchema) {
  try {
    const { data } = await api.post<ApiResponse<Transaction>>('/transaction', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: createTransaction,
  });
}
