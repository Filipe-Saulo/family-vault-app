import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/api';
import { AppError } from '@/errors/AppError';
import type { ApiResponse } from '@/types/entities/api-response';

async function deleteTransaction(transactionId: number) {
  try {
    await api.delete<ApiResponse<null>>(`/transaction/${transactionId}`);
  } catch (error) {
    if (isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
      throw new AppError(error.response.data.message);
    }
    throw error;
  }
}

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: deleteTransaction,
  });
}
