import {
  buildManualBody,
  buildPasswordBody,
  canRememberForSender,
  formatAttemptsRemaining,
  isPasswordRequired,
  receivedAtToLocalDate,
} from '@/lib/charge-upload-failure';
import { manualChargeRequestSchema } from '@/schemas/services/charge/manual-charge-request-schema';
import type { ChargeFailure } from '@/types/entities/charge';

function makeFailure(overrides: Partial<ChargeFailure>): ChargeFailure {
  return {
    documentId: 1,
    source: 'Gmail',
    sender: 'contas@empresa.com',
    receivedAt: '2026-11-10T12:00:00',
    failureReason: 'O PDF está protegido por senha.',
    status: 'PasswordRequired',
    passwordAttemptsRemaining: 3,
    ...overrides,
  };
}

describe('receivedAtToLocalDate', () => {
  it('converts a bare UTC timestamp to the local date', () => {
    const expected = new Date('2026-11-10T12:00:00Z');
    const pad = (n: number) => String(n).padStart(2, '0');
    expect(receivedAtToLocalDate('2026-11-10T12:00:00')).toBe(
      `${expected.getFullYear()}-${pad(expected.getMonth() + 1)}-${pad(expected.getDate())}`
    );
  });

  it('honours an explicit offset', () => {
    const expected = new Date('2026-11-10T23:30:00-03:00');
    const pad = (n: number) => String(n).padStart(2, '0');
    expect(receivedAtToLocalDate('2026-11-10T23:30:00-03:00')).toBe(
      `${expected.getFullYear()}-${pad(expected.getMonth() + 1)}-${pad(expected.getDate())}`
    );
  });

  it('falls back to the date part for an invalid value', () => {
    expect(receivedAtToLocalDate('2026-11-10 lixo')).toBe('2026-11-10');
  });
});

describe('failure helpers', () => {
  it('detects a password-required failure', () => {
    expect(isPasswordRequired(makeFailure({}))).toBe(true);
    expect(isPasswordRequired(makeFailure({ status: 'Failed' }))).toBe(false);
  });

  it('shows the remember switch only for Gmail with a sender', () => {
    expect(canRememberForSender(makeFailure({}))).toBe(true);
    expect(canRememberForSender(makeFailure({ sender: null }))).toBe(false);
    expect(canRememberForSender(makeFailure({ sender: '  ' }))).toBe(false);
    expect(canRememberForSender(makeFailure({ source: 'Upload' }))).toBe(false);
  });

  it('formats the attempts left', () => {
    expect(formatAttemptsRemaining(null)).toBeNull();
    expect(formatAttemptsRemaining(1)).toBe('Restam 1 tentativa');
    expect(formatAttemptsRemaining(3)).toBe('Restam 3 tentativas');
  });
});

describe('buildPasswordBody', () => {
  it('keeps rememberForSender for Gmail with a sender', () => {
    expect(buildPasswordBody(makeFailure({}), 'abc', true)).toEqual({ password: 'abc', rememberForSender: true });
  });

  it('forces false on upload', () => {
    expect(buildPasswordBody(makeFailure({ source: 'Upload', sender: null }), 'abc', true)).toEqual({
      password: 'abc',
      rememberForSender: false,
    });
  });
});

describe('buildManualBody', () => {
  const base = { description: ' Luz ', amount: 10.5, dueDate: '2026-11-20', categoryId: 2 };

  it('trims and includes the issuer', () => {
    expect(buildManualBody({ ...base, issuer: ' Energia ' })).toEqual({
      description: 'Luz',
      amount: 10.5,
      dueDate: '2026-11-20',
      categoryId: 2,
      issuer: 'Energia',
    });
  });

  it('omits an empty issuer', () => {
    expect(buildManualBody({ ...base, issuer: '  ' })).not.toHaveProperty('issuer');
  });
});

describe('manualChargeRequestSchema', () => {
  it('accepts a valid payload without issuer', () => {
    expect(
      manualChargeRequestSchema.safeParse({ description: 'Luz', amount: 10, dueDate: '2026-11-20', categoryId: 1 })
        .success
    ).toBe(true);
  });

  it('rejects a missing amount and category', () => {
    const result = manualChargeRequestSchema.safeParse({ description: 'Luz', dueDate: '2026-11-20' });
    expect(result.success).toBe(false);
  });
});
