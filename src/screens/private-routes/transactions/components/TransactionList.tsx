import { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ErrorState';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/format';
import { formatDateOnlyBR } from '@/lib/month-range';
import { PurposeCode } from '@/types/enums/purpose-code';
import type { Transaction } from '@/types/entities/transaction';

interface TransactionRowProps {
  transaction: Transaction;
  canModify: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionRow = memo(function TransactionRow({
  transaction,
  canModify,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const isIncome = transaction.transactionType.code === PurposeCode.Income;

  return (
    <Card>
      <CardContent className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="font-medium">{transaction.description}</Text>
          <Text variant="muted" className="text-xs">
            {transaction.category.description} · {transaction.transactionType.name}
          </Text>
          <Text variant="muted" className="text-xs">
            {formatDateOnlyBR(transaction.transactionDate.slice(0, 10))}
          </Text>
        </View>
        <View className="items-end gap-2">
          <Text className={isIncome ? 'font-medium text-success' : 'font-medium text-error'}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </Text>
          {canModify && (
            <View className="flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                accessibilityRole="button"
                accessibilityLabel={`Editar transação ${transaction.description}`}
                onPress={() => onEdit(transaction)}>
                <Text>Editar</Text>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                accessibilityRole="button"
                accessibilityLabel={`Excluir transação ${transaction.description}`}
                onPress={() => onDelete(transaction)}>
                <Text>Excluir</Text>
              </Button>
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );
});

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  nextPageErrorMessage: string | null;
  onRetryNextPage: () => void;
  canModify: (transaction: Transaction) => boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const keyExtractor = (item: Transaction) => String(item.transactionId);

export function TransactionList({
  transactions,
  isLoading,
  errorMessage,
  onRetry,
  isRefreshing,
  onRefresh,
  onEndReached,
  isFetchingNextPage,
  nextPageErrorMessage,
  onRetryNextPage,
  canModify,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionRow transaction={item} canModify={canModify(item)} onEdit={onEdit} onDelete={onDelete} />
    ),
    [canModify, onEdit, onDelete]
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
      data={transactions}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerClassName="gap-3"
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text variant="muted" className="mt-8 text-center">
          Nenhuma transação encontrada.
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
