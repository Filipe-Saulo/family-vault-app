import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';

interface DismissChargeVariables {
  chargeId: number;
  /** Only has an effect on charges from Gmail; uploads have no sender. */
  ignoreSender: boolean;
}

async function dismissCharge({ chargeId, ignoreSender }: DismissChargeVariables) {
  try {
    await api.post(`/charge/${chargeId}/dismiss`, { ignoreSender });
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDismissCharge() {
  return useMutation({
    mutationFn: dismissCharge,
  });
}
