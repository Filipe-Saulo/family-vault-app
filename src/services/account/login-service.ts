import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import { AppError } from '@/errors/AppError';
import type { LoginRequestSchema } from '@/schemas/services/account/login-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { AuthResponse } from '@/types/entities/auth';

async function login(payload: LoginRequestSchema) {
  const body =
    payload.method === 'email'
      ? { email: payload.email, password: payload.password }
      : { phone: payload.phone, password: payload.password };

  try {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/app/login', body);
    if (!data.data.refreshToken) {
      throw new AppError('Não foi possível concluir o login. Tente novamente.');
    }
    return { ...data.data, refreshToken: data.data.refreshToken };
  } catch (error) {
    throw toAppError(error);
  }
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
