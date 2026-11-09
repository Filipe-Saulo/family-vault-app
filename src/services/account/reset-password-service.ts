import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ResetPasswordRequestSchema } from '@/schemas/services/account/reset-password-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';

async function resetPassword(payload: ResetPasswordRequestSchema & { phone?: string; email?: string }) {
  try {
    const { data } = await api.post<ApiResponse<string | null>>('/password/reset', {
      ...(payload.email ? { email: payload.email } : { phone: payload.phone }),
      code: payload.code,
      password: payload.password,
      passwordConfirm: payload.passwordConfirm,
    });
    return data.message;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
