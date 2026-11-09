import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { RegisterRequestSchema } from '@/schemas/services/account/register-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';

type Destination = Pick<RegisterRequestSchema, 'method' | 'phoneNumber' | 'email'>;

function destinationBody(payload: Destination) {
  return payload.method === 'email' ? { email: payload.email } : { phoneNumber: payload.phoneNumber };
}

async function requestRegisterCode(payload: Destination) {
  try {
    const { data } = await api.post<ApiResponse<string | null>>('/register/code', destinationBody(payload));
    return data.message;
  } catch (error) {
    throw toAppError(error);
  }
}

async function register(payload: RegisterRequestSchema & { code: string }) {
  const body = {
    ...destinationBody(payload),
    code: payload.code,
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
    throw toAppError(error);
  }
}

export function useRegisterCode() {
  return useMutation({
    mutationFn: requestRegisterCode,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}
