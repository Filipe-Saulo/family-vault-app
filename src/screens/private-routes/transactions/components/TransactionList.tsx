import { ActivityIndicator, FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ErrorState';
import { PaginationFooter } from '@/components/PaginationFooter';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/format';
import { formatDateOnlyBR } from '@/lib/month-range';
import { PurposeCode } from '@/types/enums/purpose-code';
import type { Transaction } from '@/types/entities/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  canModify: (transaction: Transaction) => boolean;
  isDeleting: boolean;
  deletingId?: number;
  deleteErrorMessage?: string;
  onDeleteDialogOpen?: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
  pageNumber: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function TransactionList({
  transactions,
  isLoading,
  errorMessage,
  onRetry,
  canModify,
  isDeleting,
  deletingId,
  deleteErrorMessage,
  onDeleteDialogOpen,
  onEdit,
  onDelete,
  pageNumber,
  totalPages,
  onPrevPage,
  onNextPage,
}: TransactionListProps) {
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
    <View className="flex-1 gap-3">
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.transactionId)}
        contentContainerClassName="gap-3"
        ListEmptyComponent={
          <Text variant="muted" className="mt-8 text-center">
            Nenhuma transação encontrada.
          </Text>
        }
        renderItem={({ item }) => {
          const isIncome = item.transactionType.code === PurposeCode.Income;

          return (
            <Card>
              <CardContent className="flex-row items-center justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text className="font-medium">{item.description}</Text>
                  <Text variant="muted" className="text-xs">
                    {item.category.description} · {item.transactionType.name}
                  </Text>
                  <Text variant="muted" className="text-xs">
                    {formatDateOnlyBR(item.transactionDate.slice(0, 10))}
                  </Text>
                </View>
                <View className="items-end gap-2">
                  <Text className={isIncome ? 'font-medium text-success' : 'font-medium text-error'}>
                    {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
                  </Text>
                  {canModify(item) && (
                    <View className="flex-row gap-2">
                      <Button variant="outline" size="sm" onPress={() => onEdit(item)}>
                        <Text>Editar</Text>
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="destructive" size="sm">
                            <Text>Excluir</Text>
                          </Button>
                        }
                        title="Excluir transação"
                        description={`Tem certeza que deseja excluir "${item.description}"? Essa ação não pode ser desfeita.`}
                        isConfirming={isDeleting && deletingId === item.transactionId}
                        errorMessage={deletingId === item.transactionId ? deleteErrorMessage : null}
                        onOpen={onDeleteDialogOpen}
                        onConfirm={() => onDelete(item.transactionId)}
                      />
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          );
        }}
      />

      <PaginationFooter
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </View>
  );
}
