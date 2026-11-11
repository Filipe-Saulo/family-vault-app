import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import { isGmailScanFinished } from '@/lib/gmail';
import type { ApiResponse } from '@/types/entities/api-response';
import type { GmailScan } from '@/types/entities/gmail';

const POLL_INTERVAL_MS = 3000;

async function getGmailScan(scanId: number) {
  try {
    const { data } = await api.get<ApiResponse<GmailScan>>(`/gmail/scans/${scanId}`);
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useGmailScan(scanId: number | null, isPolling: boolean) {
  return useQuery({
    queryKey: ['gmail', 'scan', scanId],
    queryFn: () => getGmailScan(scanId as number),
    enabled: scanId !== null,
    gcTime: 0,
    refetchInterval: (query) => (isPolling && !isGmailScanFinished(query.state.data) ? POLL_INTERVAL_MS : false),
  });
}
