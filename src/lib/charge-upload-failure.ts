import type { ChargeFailure } from '@/types/entities/charge';

// receivedAt is a UTC timestamp; without an offset the API sends it bare, so mark it as UTC before converting.
export function parseReceivedAt(value: string): Date | null {
  const hasOffset = /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
  const date = new Date(hasOffset ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

// YYYY-MM-DD in the device local time (not slice/toISOString, which would keep the UTC day).
export function receivedAtToLocalDate(value: string): string {
  const date = parseReceivedAt(value);
  if (!date) return value.slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isPasswordRequired(failure: ChargeFailure): boolean {
  return failure.status === 'PasswordRequired';
}

// The API only remembers a password per sender for Gmail documents that have a sender.
export function canRememberForSender(failure: Pick<ChargeFailure, 'source' | 'sender'>): boolean {
  return failure.source === 'Gmail' && !!failure.sender?.trim();
}

export function formatAttemptsRemaining(attempts: number | null | undefined): string | null {
  if (attempts == null) return null;
  return `Restam ${attempts} ${attempts === 1 ? 'tentativa' : 'tentativas'}`;
}

export interface PasswordRequestBody {
  password: string;
  rememberForSender: boolean;
}

export function buildPasswordBody(
  failure: Pick<ChargeFailure, 'source' | 'sender'>,
  password: string,
  rememberForSender: boolean
): PasswordRequestBody {
  return { password, rememberForSender: canRememberForSender(failure) && rememberForSender };
}

export interface ManualChargeRequestBody {
  description: string;
  amount: number;
  dueDate: string;
  categoryId: number;
  issuer?: string;
}

export function buildManualBody(values: {
  description: string;
  amount: number;
  dueDate: string;
  categoryId: number;
  issuer?: string;
}): ManualChargeRequestBody {
  const issuer = values.issuer?.trim();
  return {
    description: values.description.trim(),
    amount: values.amount,
    dueDate: values.dueDate,
    categoryId: values.categoryId,
    ...(issuer ? { issuer } : {}),
  };
}

export const EMAIL_BODY_LABEL = 'Lida do corpo do e-mail';
export const EMAIL_BODY_WARNING = 'Esta conta foi lida do corpo do e-mail. Confira o valor e o vencimento.';
export const DUPLICATE_CHARGE_WARNING = 'Possível duplicata de outra conta em revisão';
