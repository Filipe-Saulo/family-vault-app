import { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatAttemptsRemaining, isPasswordRequired, parseReceivedAt } from '@/lib/charge-upload-failure';
import type { ChargeFailure } from '@/types/entities/charge';

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

function formatReceivedAt(value: string): string {
  const date = parseReceivedAt(value);
  return date ? dateTimeFormatter.format(date) : value.slice(0, 10);
}

interface ChargeFailureRowProps {
  failure: ChargeFailure;
  isResending: boolean;
  onResend: () => void;
  onInformPassword: (failure: ChargeFailure) => void;
  onInformAmount: (failure: ChargeFailure) => void;
}

const ChargeFailureRow = memo(function ChargeFailureRow({
  failure,
  isResending,
  onResend,
  onInformPassword,
  onInformAmount,
}: ChargeFailureRowProps) {
  const isUpload = failure.source === 'Upload';
  const needsPassword = isPasswordRequired(failure);
  const attempts = needsPassword ? formatAttemptsRemaining(failure.passwordAttemptsRemaining) : null;

  return (
    <Card>
      <CardContent className="gap-2">
        <Text className="font-medium">{failure.failureReason ?? 'Não foi possível processar o documento.'}</Text>
        <Text variant="muted" className="text-xs">
          {isUpload ? 'Enviado' : `De ${failure.sender ?? 'remetente desconhecido'}`} em{' '}
          {formatReceivedAt(failure.receivedAt)}
        </Text>
        {needsPassword ? (
          <>
            {attempts && (
              <Text variant="muted" className="text-xs">
                {attempts}
              </Text>
            )}
            <View className="flex-row gap-2">
              <Button
                className="flex-1"
                variant="outline"
                size="sm"
                accessibilityRole="button"
                accessibilityLabel="Informar a senha do PDF"
                onPress={() => onInformPassword(failure)}>
                <Text>Informar senha</Text>
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                size="sm"
                accessibilityRole="button"
                accessibilityLabel="Informar o valor da conta"
                onPress={() => onInformAmount(failure)}>
                <Text>Informar valor</Text>
              </Button>
            </View>
          </>
        ) : (
          <>
            <Text variant="muted" className="text-xs">
              Lance a despesa à mão em Transações{isUpload ? ' ou escolha o mesmo arquivo para tentar de novo.' : '.'}
            </Text>
            {isUpload && (
              <Button
                variant="outline"
                size="sm"
                disabled={isResending}
                accessibilityRole="button"
                accessibilityLabel="Escolher o arquivo para enviar de novo"
                onPress={onResend}>
                <Text>Escolher arquivo</Text>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

interface ChargeFailureListProps {
  failures: ChargeFailure[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  nextPageErrorMessage: string | null;
  onRetryNextPage: () => void;
  isResending: boolean;
  onResend: () => void;
  onInformPassword: (failure: ChargeFailure) => void;
  onInformAmount: (failure: ChargeFailure) => void;
}

const keyExtractor = (item: ChargeFailure) => String(item.documentId);

export function ChargeFailureList({
  failures,
  isLoading,
  errorMessage,
  onRetry,
  isRefreshing,
  onRefresh,
  onEndReached,
  isFetchingNextPage,
  nextPageErrorMessage,
  onRetryNextPage,
  isResending,
  onResend,
  onInformPassword,
  onInformAmount,
}: ChargeFailureListProps) {
  const renderItem = useCallback(
    ({ item }: { item: ChargeFailure }) => (
      <ChargeFailureRow
        failure={item}
        isResending={isResending}
        onResend={onResend}
        onInformPassword={onInformPassword}
        onInformAmount={onInformAmount}
      />
    ),
    [isResending, onResend, onInformPassword, onInformAmount]
  );

  if (isLoading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator />
      </View>
    );
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  return (
    <FlatList
      data={failures}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerClassName="gap-3 pb-4"
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text variant="muted" className="mt-8 text-center">
          Nenhum documento com falha.
        </Text>
      }
      ListFooterComponent={
        nextPageErrorMessage ? (
          <ErrorState message={nextPageErrorMessage} onRetry={onRetryNextPage} />
        ) : isFetchingNextPage ? (
          <View className="items-center py-4">
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}
