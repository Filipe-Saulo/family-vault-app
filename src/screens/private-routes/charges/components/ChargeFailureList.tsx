import { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { ChargeFailure } from '@/types/entities/charge';

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

// receivedAt is a UTC timestamp; without an offset the API sends it bare, so mark it as UTC before converting.
function formatReceivedAt(value: string): string {
  const hasOffset = /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
  const date = new Date(hasOffset ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : dateTimeFormatter.format(date);
}

interface ChargeFailureRowProps {
  failure: ChargeFailure;
  isResending: boolean;
  onResend: () => void;
}

const ChargeFailureRow = memo(function ChargeFailureRow({ failure, isResending, onResend }: ChargeFailureRowProps) {
  const isUpload = failure.source === 'Upload';

  return (
    <Card>
      <CardContent className="gap-2">
        <Text className="font-medium">{failure.failureReason ?? 'Não foi possível processar o documento.'}</Text>
        <Text variant="muted" className="text-xs">
          {isUpload ? 'Enviado' : `De ${failure.sender ?? 'remetente desconhecido'}`} em{' '}
          {formatReceivedAt(failure.receivedAt)}
        </Text>
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
}: ChargeFailureListProps) {
  const renderItem = useCallback(
    ({ item }: { item: ChargeFailure }) => (
      <ChargeFailureRow failure={item} isResending={isResending} onResend={onResend} />
    ),
    [isResending, onResend]
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
