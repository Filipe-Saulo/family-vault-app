import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';

async function disconnectGmail() {
  try {
    await api.delete('/gmail/connection');
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDisconnectGmail() {
  return useMutation({
    mutationFn: disconnectGmail,
  });
}
