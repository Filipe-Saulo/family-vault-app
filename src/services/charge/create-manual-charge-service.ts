import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ManualChargeRequestBody } from '@/lib/charge-upload-failure';
import type { ApiResponse } from '@/types/entities/api-response';
import type { Transaction } from '@/types/entities/transaction';

interface CreateManualChargeVariables {
  documentId: number;
  payload: ManualChargeRequestBody;
}

async function createManualCharge({ documentId, payload }: CreateManualChargeVariables) {
  try {
    const { data } = await api.post<ApiResponse<Transaction>>(`/charge/documents/${documentId}/manual`, payload);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useCreateManualCharge() {
  return useMutation({
    mutationFn: createManualCharge,
  });
}
