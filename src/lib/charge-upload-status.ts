import type { Charge, ChargeFailure } from '@/types/entities/charge';

export type UploadStatus =
  | { kind: 'processing' }
  | { kind: 'ready'; charge: Charge }
  | { kind: 'already-handled'; charge: Charge }
  | { kind: 'failed'; reason: string };

// A document that is not a bill ends without a charge and without a failure: it stays "processing" here, and the
// caller stops polling after a time limit.
export function resolveUploadStatus(
  documentId: number,
  charges: Charge[],
  failures: ChargeFailure[]
): UploadStatus {
  const charge = charges.find((item) => item.documentId === documentId);
  if (charge) {
    return charge.status === 'PendingReview' ? { kind: 'ready', charge } : { kind: 'already-handled', charge };
  }
  const failure = failures.find((item) => item.documentId === documentId);
  if (failure) {
    return { kind: 'failed', reason: failure.failureReason ?? 'Não foi possível processar o documento.' };
  }
  return { kind: 'processing' };
}
