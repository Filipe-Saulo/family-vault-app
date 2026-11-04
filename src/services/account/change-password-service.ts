import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ChangePasswordRequestSchema } from '@/schemas/services/account/change-password-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';

async function changePassword(payload: ChangePasswordRequestSchema) {
  try {
    const { data } = await api.post<ApiResponse<string | null>>('/password/change', {
      currentPassword: payload.currentPassword,
      password: payload.password,
      passwordConfirm: payload.passwordConfirm,
    });
    return data.message;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
