import { memo, useCallback, type ReactElement } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { DUPLICATE_CHARGE_WARNING, EMAIL_BODY_LABEL } from '@/lib/charge-upload-failure';
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
        {charge.possibleDuplicateChargeId != null && (
          <Text className="text-xs text-amber-600 dark:text-amber-400">{DUPLICATE_CHARGE_WARNING}</Text>
        )}
        {charge.extractionSource === 'EmailBody' && (
          <Text variant="muted" className="text-xs">
            {EMAIL_BODY_LABEL}
          </Text>
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
  /** Scrolls together with the list (the panels above it), so the list never shrinks to a strip. */
  header?: ReactElement;
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
  header,
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

  // Loading and a failed first load show in place of the items, below the header.
  const isBlocked = isLoading || !!errorMessage;
  const emptyContent = isLoading ? (
    <View className="items-center justify-center py-8">
      <ActivityIndicator />
    </View>
  ) : errorMessage ? (
    <ErrorState message={errorMessage} onRetry={onRetry} />
  ) : (
    <Text variant="muted" className="mt-8 text-center">
      Nenhuma conta para revisar.
    </Text>
  );

  return (
    <FlatList
      data={isBlocked ? [] : charges}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerClassName="gap-3 pb-4"
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={header}
      ListEmptyComponent={emptyContent}
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
