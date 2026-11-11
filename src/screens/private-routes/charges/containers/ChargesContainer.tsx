import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import type { ChargesStackRoutes } from '@/navigation/private-routes/charges-stack/chargesRoutes';
import { useChargeFailures } from '@/services/charge/list-charge-failures-service';
import { useCharges } from '@/services/charge/list-charges-service';
import type { Charge } from '@/types/entities/charge';

import { ChargeFailureList } from '../components/ChargeFailureList';
import { ChargeList } from '../components/ChargeList';
import { ChargeUploadPanel } from '../components/ChargeUploadPanel';
import { GmailPanel } from '../components/GmailPanel';
import { useChargeUpload } from './use-charge-upload';
import { useGmail } from './use-gmail';

const PAGE_SIZE = 20;

type ChargesView = 'pending' | 'failures';

function useRefreshing(refetch: () => Promise<unknown>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);
  return { isRefreshing, onRefresh };
}

export function ChargesContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<ChargesStackRoutes>>();
  const [view, setView] = useState<ChargesView>('pending');
  const upload = useChargeUpload();
  const gmail = useGmail();

  const pending = useCharges({ status: 'PendingReview', pageSize: PAGE_SIZE });
  const failures = useChargeFailures({ pageSize: PAGE_SIZE });

  const charges = useMemo(() => pending.data?.pages.flatMap((page) => page.items) ?? [], [pending.data]);
  const failureItems = useMemo(() => failures.data?.pages.flatMap((page) => page.items) ?? [], [failures.data]);

  const pendingRefresh = useRefreshing(pending.refetch);
  const failuresRefresh = useRefreshing(failures.refetch);

  const handleReview = useCallback(
    (charge: Charge) => {
      navigation.navigate('chargeReview', { charge });
    },
    [navigation]
  );

  const { hasNextPage: pendingHasNext, isFetchingNextPage: pendingFetchingNext, fetchNextPage: pendingNext } = pending;
  const handlePendingEndReached = useCallback(() => {
    if (pendingHasNext && !pendingFetchingNext) pendingNext();
  }, [pendingHasNext, pendingFetchingNext, pendingNext]);

  const {
    hasNextPage: failuresHasNext,
    isFetchingNextPage: failuresFetchingNext,
    fetchNextPage: failuresNext,
  } = failures;
  const handleFailuresEndReached = useCallback(() => {
    if (failuresHasNext && !failuresFetchingNext) failuresNext();
  }, [failuresHasNext, failuresFetchingNext, failuresNext]);

  const { start } = upload;
  const handleResend = useCallback(() => start('file'), [start]);

  // A failed refetch/next page keeps the loaded pages; only a failed first load blocks the list.
  const pendingHasData = !!pending.data;
  const failuresHasData = !!failures.data;
  const failuresCount = failures.data?.pages[0]?.totalCount ?? 0;

  return (
    <View className="flex-1">
      <GmailPanel
        status={gmail.status.data}
        isStatusLoading={gmail.status.isLoading}
        statusErrorMessage={gmail.status.isError && !gmail.status.data ? gmail.status.error.message : null}
        onRetryStatus={() => gmail.status.refetch()}
        onConnect={gmail.connect}
        isConnecting={gmail.isConnecting}
        connectErrorMessage={gmail.connectErrorMessage}
        onStartScan={gmail.startScan}
        isStartingScan={gmail.isStartingScan}
        startScanErrorMessage={gmail.startScanErrorMessage}
        scan={gmail.scan?.data}
        isTrackingScan={gmail.scan !== null}
        isScanning={gmail.isScanning}
        scanTimedOut={gmail.scanTimedOut}
        initialScanTimedOut={gmail.initialScanTimedOut}
        scanErrorMessage={gmail.scan?.isError ? gmail.scan.error.message : null}
        onRetryScan={() => gmail.scan?.refetch()}
        onClearScan={gmail.clearScan}
        onDisconnect={() => gmail.setIsDisconnectOpen(true)}
        showIgnoredSenders={gmail.showIgnoredSenders}
        onToggleIgnoredSenders={gmail.toggleIgnoredSenders}
        ignoredSenders={gmail.ignoredSenders.data}
        isIgnoredSendersLoading={gmail.ignoredSenders.isLoading}
        ignoredSendersErrorMessage={gmail.ignoredSenders.isError ? gmail.ignoredSenders.error.message : null}
        onRetryIgnoredSenders={() => gmail.ignoredSenders.refetch()}
        onRemoveIgnoredSender={gmail.removeIgnoredSender}
        removingIgnoredSenderId={gmail.removingIgnoredSenderId}
        removeIgnoredSenderErrorMessage={gmail.removeIgnoredSenderErrorMessage}
      />
      <ConfirmDialog
        open={gmail.isDisconnectOpen}
        onOpenChange={gmail.setIsDisconnectOpen}
        title="Desconectar o Gmail"
        description="O app deixa de ler seus e-mails e o acesso é revogado no Google. As contas para revisar continuam; os e-mails ainda não lidos são descartados."
        confirmLabel="Desconectar"
        confirmingLabel="Desconectando..."
        isConfirming={gmail.isDisconnecting}
        errorMessage={gmail.disconnectErrorMessage}
        onOpen={gmail.resetDisconnect}
        onConfirm={gmail.confirmDisconnect}
      />
      <ChargeUploadPanel
        onPick={upload.start}
        onClear={upload.clear}
        onReview={handleReview}
        onRetryStatus={upload.retryStatus}
        isUploading={upload.isUploading}
        errorMessage={upload.errorMessage}
        isTracking={upload.documentId !== null}
        status={upload.status}
        statusErrorMessage={upload.statusErrorMessage}
        timedOut={upload.timedOut}
      />

      <View className="mb-4 flex-row gap-2">
        <Button
          className="flex-1"
          size="sm"
          variant={view === 'pending' ? 'default' : 'outline'}
          onPress={() => setView('pending')}>
          <Text>Para revisar</Text>
        </Button>
        <Button
          className="flex-1"
          size="sm"
          variant={view === 'failures' ? 'default' : 'outline'}
          onPress={() => setView('failures')}>
          <Text>{failuresCount > 0 ? `Falharam (${failuresCount})` : 'Falharam'}</Text>
        </Button>
      </View>

      {view === 'pending' ? (
        <ChargeList
          charges={charges}
          isLoading={pending.isLoading}
          errorMessage={pending.isError && !pendingHasData ? pending.error.message : null}
          onRetry={() => pending.refetch()}
          isRefreshing={pendingRefresh.isRefreshing}
          onRefresh={pendingRefresh.onRefresh}
          onEndReached={handlePendingEndReached}
          isFetchingNextPage={pending.isFetchingNextPage}
          nextPageErrorMessage={pending.isError && pendingHasData ? pending.error.message : null}
          onRetryNextPage={() => pending.fetchNextPage()}
          onReview={handleReview}
        />
      ) : (
        <ChargeFailureList
          failures={failureItems}
          isLoading={failures.isLoading}
          errorMessage={failures.isError && !failuresHasData ? failures.error.message : null}
          onRetry={() => failures.refetch()}
          isRefreshing={failuresRefresh.isRefreshing}
          onRefresh={failuresRefresh.onRefresh}
          onEndReached={handleFailuresEndReached}
          isFetchingNextPage={failures.isFetchingNextPage}
          nextPageErrorMessage={failures.isError && failuresHasData ? failures.error.message : null}
          onRetryNextPage={() => failures.fetchNextPage()}
          isResending={upload.isUploading}
          onResend={handleResend}
        />
      )}
    </View>
  );
}
