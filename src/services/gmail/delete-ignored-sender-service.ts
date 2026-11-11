import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';

async function deleteIgnoredSender(id: number) {
  try {
    await api.delete(`/gmail/ignored-senders/${id}`);
  } catch (error) {
    throw toAppError(error);
  }
}

export function useDeleteIgnoredSender() {
  return useMutation({
    mutationFn: deleteIgnoredSender,
  });
}
