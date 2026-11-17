export type ChargeStatus = 'PendingReview' | 'Confirmed' | 'Dismissed';

export type ChargeExtractionSource = 'Document' | 'EmailBody' | 'Manual';

export type ChargeFailureStatus = 'Failed' | 'PasswordRequired';

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
  extractionSource: ChargeExtractionSource;
  // Additive field from a parallel API change: treat missing as null.
  possibleDuplicateChargeId?: number | null;
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
  status: ChargeFailureStatus;
  // Only set while status is PasswordRequired.
  passwordAttemptsRemaining: number | null;
}

export interface ChargeUploadResponse {
  documentId: number;
}
