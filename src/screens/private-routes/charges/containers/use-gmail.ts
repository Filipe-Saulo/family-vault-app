import { useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef, useState } from 'react';

import { GMAIL_RETURN_URL, isGmailScanFinished, parseGmailRedirect } from '@/lib/gmail';
import { useConnectGmail } from '@/services/gmail/connect-gmail-service';
import { useDeleteIgnoredSender } from '@/services/gmail/delete-ignored-sender-service';
import { useDisconnectGmail } from '@/services/gmail/disconnect-gmail-service';
import { useGmailScan } from '@/services/gmail/get-gmail-scan-service';
import { useGmailStatus } from '@/services/gmail/get-gmail-status-service';
import { useIgnoredSenders } from '@/services/gmail/list-ignored-senders-service';
import { useStartGmailScan } from '@/services/gmail/start-gmail-scan-service';

// Documents past the daily limit stay Pending until the next day, so a scan may never reach processed = found.
// The same limit applies to the Initial scan, followed through the status: one that failed never completes.
const SCAN_POLL_LIMIT_MS = 2 * 60 * 1000;

export function useGmail() {
  const queryClient = useQueryClient();
  const [initialScanTimedOut, setInitialScanTimedOut] = useState(false);
  const status = useGmailStatus(!initialScanTimedOut);
  const isInitialScanPending = !!status.data?.connected && !status.data.initialScanCompletedAt;
  const {
    mutateAsync: requestAuthorization,
    isPending: isRequestingAuthorization,
    error: connectError,
    reset: resetConnect,
  } = useConnectGmail();
  const {
    mutate: requestScan,
    isPending: isStartingScan,
    error: startScanError,
    reset: resetStartScan,
  } = useStartGmailScan();
  const {
    mutate: requestDisconnect,
    isPending: isDisconnecting,
    error: disconnectError,
    reset: resetDisconnect,
  } = useDisconnectGmail();
  const {
    mutate: requestDeleteIgnoredSender,
    isPending: isDeletingIgnoredSender,
    variables: deletingIgnoredSenderId,
    error: deleteIgnoredSenderError,
  } = useDeleteIgnoredSender();

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [redirectErrorMessage, setRedirectErrorMessage] = useState<string | null>(null);
  const [scanId, setScanId] = useState<number | null>(null);
  const [scanTimedOut, setScanTimedOut] = useState(false);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);
  const [showIgnoredSenders, setShowIgnoredSenders] = useState(false);

  const scan = useGmailScan(scanId, scanId !== null && !scanTimedOut);
  const ignoredSenders = useIgnoredSenders(showIgnoredSenders);

  const invalidateChargeLists = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['charges', 'list'] });
    queryClient.invalidateQueries({ queryKey: ['charges', 'failures'] });
  }, [queryClient]);

  const handleRedirect = useCallback(
    (url: string) => {
      const redirect = parseGmailRedirect(url);
      if (!redirect) return;
      setRedirectErrorMessage(redirect.kind === 'error' ? redirect.message : null);
      queryClient.invalidateQueries({ queryKey: ['gmail'] });
    },
    [queryClient]
  );

  // The auth session normally hands the redirect back itself; this covers the deep link reaching the app another way
  // (e.g. the app was restarted while the browser was open).
  // Handling the same redirect twice (auth session result and this event) is harmless.
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => handleRedirect(url));
    return () => subscription.remove();
  }, [handleRedirect]);

  const connect = useCallback(async () => {
    resetConnect();
    setRedirectErrorMessage(null);
    let authorizationUrl: string;
    try {
      ({ authorizationUrl } = await requestAuthorization(GMAIL_RETURN_URL));
    } catch {
      return; // shown through connectError
    }
    setIsAuthorizing(true);
    try {
      const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, GMAIL_RETURN_URL);
      if (result.type === 'success') handleRedirect(result.url);
    } catch {
      setRedirectErrorMessage('Não foi possível abrir o navegador. Tente de novo.');
    } finally {
      setIsAuthorizing(false);
      // A (re)connection resets the saved point and starts a new Initial scan.
      setScanId(null);
      setInitialScanTimedOut(false);
      queryClient.invalidateQueries({ queryKey: ['gmail'] });
    }
  }, [handleRedirect, queryClient, requestAuthorization, resetConnect]);

  const startScan = useCallback(() => {
    resetStartScan();
    requestScan(undefined, {
      onSuccess: ({ scanId: newScanId }) => {
        setScanTimedOut(false);
        setScanId(newScanId);
      },
    });
  }, [requestScan, resetStartScan]);

  useEffect(() => {
    if (scanId === null) return;
    const timer = setTimeout(() => setScanTimedOut(true), SCAN_POLL_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [scanId]);

  // Each processed document may be a new bill or failure; refresh the lists as they come in.
  const processed = scan.data?.processed ?? 0;
  useEffect(() => {
    if (processed > 0) invalidateChargeLists();
  }, [processed, invalidateChargeLists]);

  const scanFinished = isGmailScanFinished(scan.data);
  useEffect(() => {
    if (!scanFinished && !scanTimedOut) return;
    invalidateChargeLists();
    queryClient.invalidateQueries({ queryKey: ['gmail', 'status'] });
  }, [scanFinished, scanTimedOut, invalidateChargeLists, queryClient]);

  // The Initial scan id is not exposed: refresh the lists when the status says it finished.
  const initialScanCompletedAt = status.data?.initialScanCompletedAt ?? null;
  const previousInitialScanCompletedAt = useRef(initialScanCompletedAt);
  useEffect(() => {
    if (initialScanCompletedAt && !previousInitialScanCompletedAt.current) invalidateChargeLists();
    previousInitialScanCompletedAt.current = initialScanCompletedAt;
  }, [initialScanCompletedAt, invalidateChargeLists]);

  const confirmDisconnect = useCallback(() => {
    requestDisconnect(undefined, {
      onSuccess: () => {
        setIsDisconnectOpen(false);
        setScanId(null);
        queryClient.invalidateQueries({ queryKey: ['gmail'] });
        invalidateChargeLists();
      },
    });
  }, [requestDisconnect, invalidateChargeLists, queryClient]);

  const removeIgnoredSender = useCallback(
    (id: number) => {
      requestDeleteIgnoredSender(id, {
        onSettled: () =>
          queryClient.invalidateQueries({
            queryKey: ['gmail', 'ignored-senders'],
          }),
      });
    },
    [requestDeleteIgnoredSender, queryClient]
  );

  useEffect(() => {
    if (!isInitialScanPending || initialScanTimedOut) return;
    const timer = setTimeout(() => setInitialScanTimedOut(true), SCAN_POLL_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [isInitialScanPending, initialScanTimedOut]);

  const isScanning = scanId !== null && !scanFinished && !scanTimedOut;

  return {
    status,
    connect,
    isConnecting: isRequestingAuthorization || isAuthorizing,
    connectErrorMessage: connectError?.message ?? redirectErrorMessage,
    startScan,
    isStartingScan,
    startScanErrorMessage: startScanError?.message ?? null,
    scan: scanId !== null ? scan : null,
    isScanning,
    scanTimedOut,
    initialScanTimedOut,
    clearScan: () => setScanId(null),
    isDisconnecting,
    disconnectErrorMessage: disconnectError?.message ?? null,
    resetDisconnect,
    isDisconnectOpen,
    setIsDisconnectOpen,
    confirmDisconnect,
    showIgnoredSenders,
    toggleIgnoredSenders: () => setShowIgnoredSenders((value) => !value),
    ignoredSenders,
    removeIgnoredSender,
    removingIgnoredSenderId: isDeletingIgnoredSender ? (deletingIgnoredSenderId ?? null) : null,
    removeIgnoredSenderErrorMessage: deleteIgnoredSenderError?.message ?? null,
  };
}

export type UseGmailResult = ReturnType<typeof useGmail>;
