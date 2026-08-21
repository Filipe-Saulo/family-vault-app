import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/api';
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
    return data.data;
  } catch (error) {
    if (isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
      throw new AppError(error.response.data.message);
    }
    throw error;
  }
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
