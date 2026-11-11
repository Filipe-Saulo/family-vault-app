import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { GmailIgnoredSender } from '@/types/entities/gmail';

async function listIgnoredSenders() {
  try {
    const { data } = await api.get<ApiResponse<GmailIgnoredSender[]>>('/gmail/ignored-senders');
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useIgnoredSenders(enabled: boolean) {
  return useQuery({
    queryKey: ['gmail', 'ignored-senders'],
    queryFn: listIgnoredSenders,
    enabled,
  });
}
