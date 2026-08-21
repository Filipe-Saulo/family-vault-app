import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/api';
import { AppError } from '@/errors/AppError';
import type { CreateTransactionRequestSchema } from '@/schemas/services/transaction/create-transaction-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Transaction } from '@/types/entities/transaction';

async function createTransaction(payload: CreateTransactionRequestSchema) {
  try {
    const { data } = await api.post<ApiResponse<Transaction>>('/transaction', payload);
    return data.data;
  } catch (error) {
    if (isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
      throw new AppError(error.response.data.message);
    }
    throw error;
  }
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: createTransaction,
  });
}
