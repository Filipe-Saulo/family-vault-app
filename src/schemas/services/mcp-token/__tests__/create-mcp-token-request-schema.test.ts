import { createMcpTokenRequestSchema } from '@/schemas/services/mcp-token/create-mcp-token-request-schema';

describe('createMcpTokenRequestSchema', () => {
  it('trims the name and keeps the validity', () => {
    expect(createMcpTokenRequestSchema.parse({ name: '  Claude Code  ', expiresInDays: 30 })).toEqual({
      name: 'Claude Code',
      expiresInDays: 30,
    });
  });

  it('requires a name', () => {
    const result = createMcpTokenRequestSchema.safeParse({ name: '   ', expiresInDays: 90 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Dê um nome ao token.');
  });

  it('limits the name to 100 characters', () => {
    expect(createMcpTokenRequestSchema.safeParse({ name: 'a'.repeat(100), expiresInDays: 90 }).success).toBe(true);
    expect(createMcpTokenRequestSchema.safeParse({ name: 'a'.repeat(101), expiresInDays: 90 }).success).toBe(false);
  });

  it('accepts only 30, 90 or 365 days', () => {
    expect(createMcpTokenRequestSchema.safeParse({ name: 'x', expiresInDays: 365 }).success).toBe(true);
    expect(createMcpTokenRequestSchema.safeParse({ name: 'x', expiresInDays: 60 }).success).toBe(false);
  });
});
