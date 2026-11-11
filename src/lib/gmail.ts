import type { GmailScan } from '@/types/entities/gmail';

/** Deep link the API redirects to after the Google consent. Must be one of the API's `Gmail:AllowedReturnUrls`. */
export const GMAIL_RETURN_URL = 'familyvault://gmail';

export type GmailRedirectResult = { kind: 'connected' } | { kind: 'error'; message: string };

const ERROR_MESSAGES: Record<string, string> = {
  state: 'O pedido de conexão venceu. Tente conectar de novo.',
  denied: 'A conexão com o Gmail foi cancelada.',
  scope: 'Para ler as contas, marque a permissão de leitura do Gmail ao autorizar.',
  failed: 'Não foi possível conectar o Gmail. Tente de novo.',
};

function readQueryParams(url: string): Record<string, string> {
  const query = url.split('#')[0].split('?')[1] ?? '';
  const params: Record<string, string> = {};
  for (const pair of query.split('&')) {
    if (!pair) continue;
    const [key, value = ''] = pair.split('=');
    try {
      params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
    } catch {
      // malformed escape: skip the pair
    }
  }
  return params;
}

/** Reads `?gmail=connected` or `?gmail=error&reason=...` from the deep link the API redirects to. */
export function parseGmailRedirect(url: string): GmailRedirectResult | null {
  if (!url.startsWith(GMAIL_RETURN_URL) || !/^($|[?#/])/.test(url.slice(GMAIL_RETURN_URL.length))) return null;
  const { gmail, reason } = readQueryParams(url);
  if (gmail === 'connected') return { kind: 'connected' };
  if (gmail === 'error') {
    return {
      kind: 'error',
      message: ERROR_MESSAGES[reason ?? ''] ?? ERROR_MESSAGES.failed,
    };
  }
  return null;
}

/**
 * A scan turns Completed when the Gmail listing ends; reading the documents goes on afterwards. It is done when it
 * failed or when every document it found was processed.
 */
export function isGmailScanFinished(scan: GmailScan | undefined): boolean {
  if (!scan) return false;
  if (scan.status === 'Failed') return true;
  return scan.status === 'Completed' && scan.processed >= scan.found;
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

/** API timestamps are UTC; without an offset they come bare, so mark them as UTC before converting. */
export function formatUtcDateTime(value: string): string {
  const hasOffset = /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
  const date = new Date(hasOffset ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : dateTimeFormatter.format(date);
}
