import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { UpdateUserRequestSchema } from '@/schemas/services/user/update-user-request-schema';
import type { ApiResponse } from '@/types/entities/api-response';
import type { User } from '@/types/entities/user';

async function updateUser(userId: string, payload: UpdateUserRequestSchema) {
  try {
    const { data } = await api.put<ApiResponse<User>>(`/User/${userId}`, payload);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserRequestSchema }) =>
      updateUser(userId, payload),
  });
}
