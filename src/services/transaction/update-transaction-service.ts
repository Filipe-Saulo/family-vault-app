import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { UpdateTransactionRequestSchema } from '@/schemas/services/transaction/update-transaction-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Transaction } from '@/types/entities/transaction';

async function updateTransaction(transactionId: number, payload: UpdateTransactionRequestSchema) {
  try {
    const { data } = await api.put<ApiResponse<Transaction>>(`/transaction/${transactionId}`, payload);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useUpdateTransaction() {
  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: {
      transactionId: number;
      payload: UpdateTransactionRequestSchema;
    }) => updateTransaction(transactionId, payload),
  });
}
