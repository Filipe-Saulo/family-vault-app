import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';

async function deleteTransaction(transactionId: number) {
  try {
    await api.delete<ApiResponse<null>>(`/transaction/${transactionId}`);
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: deleteTransaction,
  });
}
