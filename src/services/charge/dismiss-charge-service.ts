import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';

async function dismissCharge(chargeId: number) {
  try {
    // ignoreSender only applies to charges from Gmail; uploads have no sender.
    await api.post(`/charge/${chargeId}/dismiss`, { ignoreSender: false });
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDismissCharge() {
  return useMutation({
    mutationFn: dismissCharge,
  });
}
