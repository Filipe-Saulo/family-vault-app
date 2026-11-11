import { ActivityIndicator, ScrollView, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatUtcDateTime, isGmailScanFinished } from '@/lib/gmail';
import type { GmailIgnoredSender, GmailScan, GmailStatus } from '@/types/entities/gmail';

interface GmailPanelProps {
  status: GmailStatus | undefined;
  isStatusLoading: boolean;
  statusErrorMessage: string | null;
  onRetryStatus: () => void;
  onConnect: () => void;
  isConnecting: boolean;
  connectErrorMessage: string | null;
  onStartScan: () => void;
  isStartingScan: boolean;
  startScanErrorMessage: string | null;
  scan: GmailScan | undefined;
  isTrackingScan: boolean;
  isScanning: boolean;
  scanTimedOut: boolean;
  /** The Initial scan is only followed through the status, for a while; one that failed never completes. */
  initialScanTimedOut: boolean;
  scanErrorMessage: string | null;
  onRetryScan: () => void;
  onClearScan: () => void;
  onDisconnect: () => void;
  showIgnoredSenders: boolean;
  onToggleIgnoredSenders: () => void;
  ignoredSenders: GmailIgnoredSender[] | undefined;
  isIgnoredSendersLoading: boolean;
  ignoredSendersErrorMessage: string | null;
  onRetryIgnoredSenders: () => void;
  onRemoveIgnoredSender: (id: number) => void;
  removingIgnoredSenderId: number | null;
  removeIgnoredSenderErrorMessage: string | null;
}

function ScanProgress({
  scan,
  scanTimedOut,
  scanErrorMessage,
  onRetryScan,
}: Pick<GmailPanelProps, 'scan' | 'scanTimedOut' | 'scanErrorMessage' | 'onRetryScan'>) {
  if (scan?.status === 'Failed') {
    return <Text className="text-sm text-error">A verificação falhou. Tente de novo em instantes.</Text>;
  }
  if (isGmailScanFinished(scan)) {
    return (
      <Text className="text-sm text-success">
        {scan?.found ? `Verificação concluída: ${scan.found} documento(s) lido(s).` : 'Nenhuma conta nova no Gmail.'}
      </Text>
    );
  }
  if (scanTimedOut) {
    return (
      <Text variant="muted" className="text-sm">
        A leitura está demorando. As contas aparecem em &quot;Para revisar&quot; quando ficarem prontas.
      </Text>
    );
  }
  if (scanErrorMessage) {
    return <ErrorState message={scanErrorMessage} onRetry={onRetryScan} />;
  }
  return (
    <View className="flex-row items-center gap-2">
      <ActivityIndicator />
      <Text className="text-sm">
        {scan && scan.found > 0 ? `Lendo as contas: ${scan.processed} de ${scan.found}.` : 'Procurando e-mails...'}
      </Text>
    </View>
  );
}

function IgnoredSenders({
  ignoredSenders,
  isIgnoredSendersLoading,
  ignoredSendersErrorMessage,
  onRetryIgnoredSenders,
  onRemoveIgnoredSender,
  removingIgnoredSenderId,
  removeIgnoredSenderErrorMessage,
}: Pick<
  GmailPanelProps,
  | 'ignoredSenders'
  | 'isIgnoredSendersLoading'
  | 'ignoredSendersErrorMessage'
  | 'onRetryIgnoredSenders'
  | 'onRemoveIgnoredSender'
  | 'removingIgnoredSenderId'
  | 'removeIgnoredSenderErrorMessage'
>) {
  if (isIgnoredSendersLoading) return <ActivityIndicator />;
  if (ignoredSendersErrorMessage) {
    return <ErrorState message={ignoredSendersErrorMessage} onRetry={onRetryIgnoredSenders} />;
  }
  if (!ignoredSenders?.length) {
    return (
      <Text variant="muted" className="text-sm">
        Nenhum remetente ignorado.
      </Text>
    );
  }
  return (
    <ScrollView className="max-h-40" contentContainerClassName="gap-2" nestedScrollEnabled>
      {ignoredSenders.map((item) => (
        <View key={item.id} className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-sm" numberOfLines={1}>
            {item.sender}
          </Text>
          <Button
            variant="outline"
            size="sm"
            disabled={removingIgnoredSenderId !== null}
            accessibilityLabel={`Voltar a ler os e-mails de ${item.sender}`}
            onPress={() => onRemoveIgnoredSender(item.id)}>
            <Text>{removingIgnoredSenderId === item.id ? 'Desfazendo...' : 'Desfazer'}</Text>
          </Button>
        </View>
      ))}
      {removeIgnoredSenderErrorMessage && <Text className="text-sm text-error">{removeIgnoredSenderErrorMessage}</Text>}
    </ScrollView>
  );
}

export function GmailPanel(props: GmailPanelProps) {
  const {
    status,
    isStatusLoading,
    statusErrorMessage,
    onRetryStatus,
    onConnect,
    isConnecting,
    connectErrorMessage,
    onStartScan,
    isStartingScan,
    startScanErrorMessage,
    isTrackingScan,
    isScanning,
    initialScanTimedOut,
    onClearScan,
    onDisconnect,
    showIgnoredSenders,
    onToggleIgnoredSenders,
  } = props;

  if (isStatusLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="items-center">
          <ActivityIndicator />
        </CardContent>
      </Card>
    );
  }

  if (statusErrorMessage || !status) {
    return (
      <Card className="mb-4">
        <CardContent>
          <ErrorState
            message={statusErrorMessage ?? 'Não foi possível ler a conexão com o Gmail.'}
            onRetry={onRetryStatus}
          />
        </CardContent>
      </Card>
    );
  }

  const hasConnection = status.status !== null;
  const isInitialScanRunning = status.connected && !status.initialScanCompletedAt;

  return (
    <Card className="mb-4">
      <CardContent className="gap-3">
        <Text className="font-medium">Gmail</Text>

        {!status.connected && (
          <>
            <Text variant="muted" className="text-sm">
              {status.status === 'Revoked'
                ? 'O acesso ao Gmail expirou ou foi revogado. Reconecte para continuar buscando contas.'
                : 'Conecte o Gmail para buscar as contas com PDF que chegam por e-mail.'}
            </Text>
            <Button size="sm" disabled={isConnecting} onPress={onConnect}>
              <Text>
                {isConnecting
                  ? 'Abrindo o Google...'
                  : status.status === 'Revoked'
                    ? 'Reconectar Gmail'
                    : 'Conectar Gmail'}
              </Text>
            </Button>
          </>
        )}

        {status.connected && (
          <>
            {status.googleEmail && (
              <Text variant="muted" className="text-sm">
                Conectado como {status.googleEmail}
              </Text>
            )}
            {isInitialScanRunning && initialScanTimedOut ? (
              <Text variant="muted" className="text-sm">
                A primeira verificação está demorando. As contas aparecem em &quot;Para revisar&quot; quando ficarem
                prontas; se nada aparecer, toque em &quot;Buscar novas contas&quot;.
              </Text>
            ) : isInitialScanRunning ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator />
                <Text className="flex-1 text-sm">Primeira verificação em andamento: lendo os últimos 90 dias.</Text>
              </View>
            ) : (
              <Text variant="muted" className="text-sm">
                {status.syncedUntil
                  ? `Última verificação: ${formatUtcDateTime(status.syncedUntil)}`
                  : 'Nenhuma verificação concluída.'}
              </Text>
            )}
            <Button
              size="sm"
              disabled={isStartingScan || isScanning || (isInitialScanRunning && !initialScanTimedOut)}
              onPress={onStartScan}>
              <Text>{isStartingScan ? 'Iniciando...' : 'Buscar novas contas'}</Text>
            </Button>
            {startScanErrorMessage && <Text className="text-sm text-error">{startScanErrorMessage}</Text>}
            {isTrackingScan && (
              <>
                <ScanProgress {...props} />
                {!isScanning && (
                  <Button variant="ghost" size="sm" onPress={onClearScan}>
                    <Text>Fechar</Text>
                  </Button>
                )}
              </>
            )}
          </>
        )}

        {connectErrorMessage && <Text className="text-sm text-error">{connectErrorMessage}</Text>}

        {hasConnection && (
          <View className="flex-row gap-2">
            <Button className="flex-1" variant="ghost" size="sm" onPress={onToggleIgnoredSenders}>
              <Text>{showIgnoredSenders ? 'Ocultar ignorados' : 'Remetentes ignorados'}</Text>
            </Button>
            <Button className="flex-1" variant="ghost" size="sm" onPress={onDisconnect}>
              <Text>Desconectar</Text>
            </Button>
          </View>
        )}

        {hasConnection && showIgnoredSenders && <IgnoredSenders {...props} />}
      </CardContent>
    </Card>
  );
}
