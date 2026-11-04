import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ForgotPasswordRequestSchema } from '@/schemas/services/account/forgot-password-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';

async function forgotPassword(payload: ForgotPasswordRequestSchema) {
  try {
    const { data } = await api.post<ApiResponse<string | null>>('/password/forgot', { phone: payload.phone });
    return data.message;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}
