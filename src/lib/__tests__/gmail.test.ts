import { formatUtcDateTime, GMAIL_RETURN_URL, isGmailScanFinished, parseGmailRedirect } from '@/lib/gmail';
import type { GmailScan } from '@/types/entities/gmail';

function makeScan(overrides: Partial<GmailScan>): GmailScan {
  return { kind: 'Manual', status: 'Running', found: 0, processed: 0, ...overrides };
}

describe('parseGmailRedirect', () => {
  it('reads a successful connection', () => {
    expect(parseGmailRedirect(`${GMAIL_RETURN_URL}?gmail=connected`)).toEqual({ kind: 'connected' });
  });

  it.each([
    ['state', 'O pedido de conexão venceu. Tente conectar de novo.'],
    ['denied', 'A conexão com o Gmail foi cancelada.'],
    ['scope', 'Para ler as contas, marque a permissão de leitura do Gmail ao autorizar.'],
    ['failed', 'Não foi possível conectar o Gmail. Tente de novo.'],
  ])('maps the %s error to a message', (reason, message) => {
    expect(parseGmailRedirect(`${GMAIL_RETURN_URL}?gmail=error&reason=${reason}`)).toEqual({ kind: 'error', message });
  });

  it('falls back to the generic message for an unknown or missing reason', () => {
    const generic = { kind: 'error', message: 'Não foi possível conectar o Gmail. Tente de novo.' };
    expect(parseGmailRedirect(`${GMAIL_RETURN_URL}?gmail=error&reason=other`)).toEqual(generic);
    expect(parseGmailRedirect(`${GMAIL_RETURN_URL}?gmail=error`)).toEqual(generic);
  });

  it('ignores links that are not a Gmail redirect', () => {
    expect(parseGmailRedirect('familyvault://transactions')).toBeNull();
    expect(parseGmailRedirect('familyvault://gmailx?gmail=connected')).toBeNull();
    expect(parseGmailRedirect('familyvault://gmail-foo?gmail=connected')).toBeNull();
  });
});

describe('isGmailScanFinished', () => {
  it('is not finished while running or while documents are still being read', () => {
    expect(isGmailScanFinished(undefined)).toBe(false);
    expect(isGmailScanFinished(makeScan({ status: 'Running', found: 3, processed: 3 }))).toBe(false);
    expect(isGmailScanFinished(makeScan({ status: 'Completed', found: 3, processed: 1 }))).toBe(false);
  });

  it('is finished when completed with every document read, or when it failed', () => {
    expect(isGmailScanFinished(makeScan({ status: 'Completed', found: 3, processed: 3 }))).toBe(true);
    expect(isGmailScanFinished(makeScan({ status: 'Completed', found: 0, processed: 0 }))).toBe(true);
    expect(isGmailScanFinished(makeScan({ status: 'Failed', found: 3, processed: 1 }))).toBe(true);
  });
});

describe('formatUtcDateTime', () => {
  it('treats a timestamp without offset as UTC', () => {
    expect(formatUtcDateTime('2026-11-10T12:00:00')).toBe(formatUtcDateTime('2026-11-10T12:00:00Z'));
  });

  it('keeps the date part of an invalid value', () => {
    expect(formatUtcDateTime('2026-11-10Tinvalid')).toBe('2026-11-10');
  });
});
