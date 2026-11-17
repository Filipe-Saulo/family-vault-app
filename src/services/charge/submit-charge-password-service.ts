import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { PasswordRequestBody } from '@/lib/charge-upload-failure';
import type { ApiResponse } from '@/types/entities/api-response';
import type { ChargeUploadResponse } from '@/types/entities/charge';

interface SubmitChargePasswordVariables {
  documentId: number;
  payload: PasswordRequestBody;
}

async function submitChargePassword({ documentId, payload }: SubmitChargePasswordVariables) {
  try {
    const { data } = await api.post<ApiResponse<ChargeUploadResponse>>(
      `/charge/documents/${documentId}/password`,
      payload
    );
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useSubmitChargePassword() {
  return useMutation({
    mutationFn: submitChargePassword,
    // The variables hold the password: drop them from the mutation cache as soon as the screen lets go
    gcTime: 0,
  });
}
