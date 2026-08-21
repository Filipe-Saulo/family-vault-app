import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/api';
import { AppError } from '@/errors/AppError';
import type { UpdateUserRequestSchema } from '@/schemas/services/user/update-user-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { User } from '@/types/entities/user';

async function updateUser(userId: string, payload: UpdateUserRequestSchema) {
  try {
    const { data } = await api.put<ApiResponse<User>>(`/User/${userId}`, payload);
    return data.data;
  } catch (error) {
    if (isAxiosError<ApiResponse<unknown>>(error) && error.response?.data?.message) {
      throw new AppError(error.response.data.message);
    }
    throw error;
  }
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserRequestSchema }) =>
      updateUser(userId, payload),
  });
}
