import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';

async function revokeMcpToken(id: number) {
  try {
    await api.delete(`/user/me/mcp-tokens/${id}`);
  } catch (error) {
    throw toAppError(error);
  }
}

export function useRevokeMcpToken() {
  return useMutation({
    mutationFn: revokeMcpToken,
  });
}
