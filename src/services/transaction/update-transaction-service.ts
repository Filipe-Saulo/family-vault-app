import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/api';
import { AppError } from '@/errors/AppError';
import type { UpdateTransactionRequestSchema } from '@/schemas/services/transaction/update-transaction-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Transaction } from '@/types/entities/transaction';

async function updateTransaction(transactionId: number, payload: UpdateTransactionRequestSchema) {
  try {
    const { data } = await api.put<ApiResponse<Transaction>>(`/transaction/${transactionId}`, payload);
    return data.data;
  } catch (error) {
    if (isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
      throw new AppError(error.response.data.message);
    }
    throw error;
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
