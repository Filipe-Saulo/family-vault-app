import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';

interface GmailScanCreatedResponse {
  scanId: number;
}

// 409 (a scan is already running) and 429 (less than a minute since the last one) come with a Portuguese message
// from the API, which toAppError keeps.
async function startGmailScan() {
  try {
    const { data } = await api.post<ApiResponse<GmailScanCreatedResponse>>('/gmail/scans');
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useStartGmailScan() {
  return useMutation({
    mutationFn: startGmailScan,
  });
}
