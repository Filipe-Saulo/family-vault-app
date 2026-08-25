import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/api';
import { AppError } from '@/errors/AppError';
import type { RegisterRequestSchema } from '@/schemas/services/account/register-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';

async function register(payload: RegisterRequestSchema) {
  const body = {
    phoneNumber: payload.phoneNumber,
    password: payload.password,
    passwordConfirm: payload.passwordConfirm,
    firstName: payload.firstName,
    lastName: payload.lastName,
    age: payload.age,
  };

  try {
    const { data } = await api.post<ApiResponse<string | null>>('/register', body);
    return data.message;
  } catch (error) {
    if (isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
      throw new AppError(error.response.data.message);
    }
    throw error;
  }
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}
