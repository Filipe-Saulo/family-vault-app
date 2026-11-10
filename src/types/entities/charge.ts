export type ChargeStatus = 'PendingReview' | 'Confirmed' | 'Dismissed';

export interface Charge {
  chargeId: number;
  documentId: number;
  source: string;
  issuer: string | null;
  description: string | null;
  amount: number | null;
  dueDate: string | null;
  barcode: string | null;
  suggestedCategoryId: number | null;
  possibleDuplicateTransactionId: number | null;
  status: ChargeStatus;
  transactionId: number | null;
  createdAt: string;
}

export interface ChargeFailure {
  documentId: number;
  source: string;
  sender: string | null;
  receivedAt: string;
  failureReason: string | null;
}

export interface ChargeUploadResponse {
  documentId: number;
}
