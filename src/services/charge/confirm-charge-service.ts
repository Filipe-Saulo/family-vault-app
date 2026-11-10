import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ConfirmChargeRequestSchema } from '@/schemas/services/charge/confirm-charge-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Transaction } from '@/types/entities/transaction';

interface ConfirmChargeVariables {
  chargeId: number;
  payload: ConfirmChargeRequestSchema;
}

async function confirmCharge({ chargeId, payload }: ConfirmChargeVariables) {
  try {
    const { data } = await api.post<ApiResponse<Transaction>>(`/charge/${chargeId}/confirm`, payload);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useConfirmCharge() {
  return useMutation({
    mutationFn: confirmCharge,
  });
}
