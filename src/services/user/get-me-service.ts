import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { CurrentUser } from '@/types/entities/user';

async function getMe() {
  try {
    const { data } = await api.get<ApiResponse<CurrentUser>>('/user/me');
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });
}
