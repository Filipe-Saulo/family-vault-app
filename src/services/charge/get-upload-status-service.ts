import { useQuery } from '@tanstack/react-query';

import { resolveUploadStatus, type UploadStatus } from '@/lib/charge-upload-status';

import { listChargeFailures } from './list-charge-failures-service';
import { listCharges } from './list-charges-service';

// The API has no per-document status route. Charges and failures come newest first, so the first page of each is
// enough to find a document that was just uploaded.
const LOOKUP_PAGE_SIZE = 20;
const POLL_INTERVAL_MS = 3000;

async function getUploadStatus(documentId: number): Promise<UploadStatus> {
  const [charges, failures] = await Promise.all([
    listCharges({ pageNumber: 1, pageSize: LOOKUP_PAGE_SIZE }),
    listChargeFailures({ pageNumber: 1, pageSize: LOOKUP_PAGE_SIZE }),
  ]);
  return resolveUploadStatus(documentId, charges.items, failures.items);
}

export function useUploadStatus(documentId: number | null, isPolling: boolean) {
  return useQuery({
    queryKey: ['charges', 'upload-status', documentId],
    queryFn: () => getUploadStatus(documentId as number),
    enabled: documentId !== null,
    gcTime: 0,
    refetchInterval: (query) =>
      isPolling && (!query.state.data || query.state.data.kind === 'processing') ? POLL_INTERVAL_MS : false,
  });
}
