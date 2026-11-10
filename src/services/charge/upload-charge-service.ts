import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';
import { toAppError } from '@/api/to-app-error';
import type { ChargeUploadFile } from '@/lib/charge-upload-file';
import type { ApiResponse } from '@/types/entities/api-response';
import type { ChargeUploadResponse } from '@/types/entities/charge';

// Up to 10 MB on a mobile connection: longer than the client's default 30 s.
const UPLOAD_TIMEOUT_MS = 120000;

async function uploadCharge(file: ChargeUploadFile) {
  try {
    const form = new FormData();
    // React Native's FormData takes a { uri, name, type } descriptor and streams the file from the uri.
    form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
    const { data } = await api.post<ApiResponse<ChargeUploadResponse>>('/charge/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: UPLOAD_TIMEOUT_MS,
    });
    return data.data;
  } catch (error) {
    throw toAppError(error);
  }
}

export function useUploadCharge() {
  return useMutation({
    mutationFn: uploadCharge,
  });
}
