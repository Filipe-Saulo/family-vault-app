export interface McpToken {
  id: number;
  name: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  /** The list keeps expired tokens (until revoked); they no longer authenticate. */
  isExpired: boolean;
}

/** Only the POST response carries the value, and only once. */
export interface McpTokenCreated extends McpToken {
  token: string;
}
