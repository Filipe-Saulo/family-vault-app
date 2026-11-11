import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';
import type { GmailStatus } from '@/types/entities/gmail';

const INITIAL_SCAN_POLL_MS = 5000;

async function getGmailStatus() {
  try {
    const { data } = await api.get<ApiResponse<GmailStatus>>('/gmail/status');
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useGmailStatus(pollInitialScan: boolean) {
  return useQuery({
    queryKey: ['gmail', 'status'],
    queryFn: getGmailStatus,
    // The status route does not expose the Initial scan id, so its progress is followed by polling the status until
    // initialScanCompletedAt shows up.
    refetchInterval: (query) => {
      const status = query.state.data;
      return pollInitialScan && status?.connected && !status.initialScanCompletedAt ? INITIAL_SCAN_POLL_MS : false;
    },
  });
}
