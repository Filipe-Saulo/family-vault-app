import {
  countActiveMcpTokens,
  DEFAULT_MCP_TOKEN_VALIDITY,
  describeMcpTokenExpiry,
  describeMcpTokenLastUse,
  MCP_TOKEN_VALIDITY_OPTIONS,
} from '@/lib/mcp-tokens';

describe('MCP token validity', () => {
  it('offers the values the API accepts, with 90 as default', () => {
    expect(MCP_TOKEN_VALIDITY_OPTIONS).toEqual([30, 90, 365]);
    expect(DEFAULT_MCP_TOKEN_VALIDITY).toBe(90);
  });
});

describe('describeMcpTokenExpiry', () => {
  it('says when an active token expires', () => {
    expect(describeMcpTokenExpiry({ expiresAt: '2027-02-09T12:00:00', isExpired: false })).toMatch(/^Vence em \d{2}\/\d{2}\/\d{4}/);
  });

  it('marks an expired token', () => {
    expect(describeMcpTokenExpiry({ expiresAt: '2026-01-01T12:00:00Z', isExpired: true })).toMatch(/^Venceu em /);
  });
});

describe('describeMcpTokenLastUse', () => {
  it('handles a token never used', () => {
    expect(describeMcpTokenLastUse({ lastUsedAt: null })).toBe('Nunca usado');
  });

  it('shows the last use', () => {
    expect(describeMcpTokenLastUse({ lastUsedAt: '2026-11-11T10:00:00' })).toMatch(/^Último uso em /);
  });
});

describe('countActiveMcpTokens', () => {
  it('ignores expired tokens and an empty list', () => {
    expect(countActiveMcpTokens(undefined)).toBe(0);
    expect(countActiveMcpTokens([{ isExpired: false }, { isExpired: true }, { isExpired: false }])).toBe(2);
  });
});
