import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ApiResponse } from '@/types/entities/api-response';

interface GmailConnectResponse {
  authorizationUrl: string;
}

async function connectGmail(returnUrl: string) {
  try {
    const { data } = await api.post<ApiResponse<GmailConnectResponse>>('/gmail/connect', { returnUrl });
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useConnectGmail() {
  return useMutation({
    mutationFn: connectGmail,
  });
}
