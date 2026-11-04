import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';

async function deleteUser(userId: string) {
  try {
    await api.delete<ApiResponse<null>>(`/User/${userId}`);
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: deleteUser,
  });
}
