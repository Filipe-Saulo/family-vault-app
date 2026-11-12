import { formatUtcDateTime } from '@/lib/gmail';
import type { McpToken } from '@/types/entities/mcp-token';

/** Validity choices the API accepts (`expiresInDays`); the API defaults to 90. */
export const MCP_TOKEN_VALIDITY_OPTIONS = [30, 90, 365] as const;
export type McpTokenValidity = (typeof MCP_TOKEN_VALIDITY_OPTIONS)[number];
export const DEFAULT_MCP_TOKEN_VALIDITY: McpTokenValidity = 90;

/** Active tokens per person; the API answers 409 above it. */
export const MAX_ACTIVE_MCP_TOKENS = 5;

export function describeMcpTokenExpiry(token: Pick<McpToken, 'expiresAt' | 'isExpired'>): string {
  const date = formatUtcDateTime(token.expiresAt);
  return token.isExpired ? `Venceu em ${date}` : `Vence em ${date}`;
}

export function describeMcpTokenLastUse(token: Pick<McpToken, 'lastUsedAt'>): string {
  return token.lastUsedAt ? `Último uso em ${formatUtcDateTime(token.lastUsedAt)}` : 'Nunca usado';
}

export function countActiveMcpTokens(tokens: Pick<McpToken, 'isExpired'>[] | undefined): number {
  return tokens?.filter((token) => !token.isExpired).length ?? 0;
}
