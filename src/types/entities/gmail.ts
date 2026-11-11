export type GmailConnectionStatus = 'Active' | 'Revoked';

export interface GmailStatus {
  /** True only while the connection is Active. */
  connected: boolean;
  googleEmail: string | null;
  /** Null when there is no connection at all. */
  status: GmailConnectionStatus | null;
  initialScanCompletedAt: string | null;
  syncedUntil: string | null;
}

export type GmailScanKind = 'Initial' | 'Manual';
export type GmailScanStatus = 'Running' | 'Completed' | 'Failed';

export interface GmailScan {
  kind: GmailScanKind;
  status: GmailScanStatus;
  found: number;
  processed: number;
}

export interface GmailIgnoredSender {
  id: number;
  sender: string;
  createdAt: string;
}
