import { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/format';
import { formatDateOnlyBR } from '@/lib/month-range';
import type { Charge } from '@/types/entities/charge';

export const DUPLICATE_WARNING = 'Possível duplicada: já há uma despesa com o mesmo valor e data próxima.';

interface ChargeRowProps {
  charge: Charge;
  onReview: (charge: Charge) => void;
}

const ChargeRow = memo(function ChargeRow({ charge, onReview }: ChargeRowProps) {
  const title = charge.description ?? charge.issuer ?? 'Conta sem descrição';

  return (
    <Card>
      <CardContent className="gap-2">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="font-medium">{title}</Text>
            {charge.issuer && charge.description && (
              <Text variant="muted" className="text-xs">
                {charge.issuer}
              </Text>
            )}
            <Text variant="muted" className="text-xs">
              {charge.dueDate ? `Vence em ${formatDateOnlyBR(charge.dueDate.slice(0, 10))}` : 'Vencimento a preencher'}
            </Text>
          </View>
          <Text className="font-medium text-error">
            {charge.amount != null ? formatCurrency(charge.amount) : 'Valor a preencher'}
          </Text>
        </View>
        {charge.possibleDuplicateTransactionId != null && (
          <Text className="text-xs text-amber-600 dark:text-amber-400">{DUPLICATE_WARNING}</Text>
        )}
        <Button
          variant="outline"
          size="sm"
          accessibilityRole="button"
          accessibilityLabel={`Revisar conta ${title}`}
          onPress={() => onReview(charge)}>
          <Text>Revisar</Text>
        </Button>
      </CardContent>
    </Card>
  );
});

interface ChargeListProps {
  charges: Charge[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  nextPageErrorMessage: string | null;
  onRetryNextPage: () => void;
  onReview: (charge: Charge) => void;
}

const keyExtractor = (item: Charge) => String(item.chargeId);

export function ChargeList({
  charges,
  isLoading,
  errorMessage,
  onRetry,
  isRefreshing,
  onRefresh,
  onEndReached,
  isFetchingNextPage,
  nextPageErrorMessage,
  onRetryNextPage,
  onReview,
}: ChargeListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Charge }) => <ChargeRow charge={item} onReview={onReview} />,
    [onReview]
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
      data={charges}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerClassName="gap-3 pb-4"
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text variant="muted" className="mt-8 text-center">
          Nenhuma conta para revisar.
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
