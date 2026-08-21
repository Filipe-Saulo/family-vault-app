import { FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import { PurposeCode } from '@/types/enums/purpose-code';
import type { Transaction } from '@/types/entities/transaction';
import type { TransactionType } from '@/types/entities/transaction-type';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

interface TransactionListProps {
  transactions: Transaction[];
  transactionTypes: TransactionType[];
  canModify: (transaction: Transaction) => boolean;
  isDeleting: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
  pageNumber: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function TransactionList({
  transactions,
  transactionTypes,
  canModify,
  isDeleting,
  onEdit,
  onDelete,
  pageNumber,
  totalPages,
  onPrevPage,
  onNextPage,
}: TransactionListProps) {
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
          const type = transactionTypes.find((t) => t.transactionTypeId === item.transactionType.transactionTypeId);
          const isIncome = type?.code === PurposeCode.Income;

          return (
            <Card>
              <CardContent className="flex-row items-center justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text className="font-medium">{item.description}</Text>
                  <Text variant="muted" className="text-xs">
                    {item.category.description} · {item.transactionType.name}
                  </Text>
                  <Text variant="muted" className="text-xs">
                    {new Date(item.transactionDate).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <View className="items-end gap-2">
                  <Text className={isIncome ? 'font-medium text-success' : 'font-medium text-error'}>
                    {isIncome ? '+' : '-'} {currencyFormatter.format(item.amount)}
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
                        isConfirming={isDeleting}
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

      {totalPages > 1 && (
        <View className="flex-row items-center justify-between">
          <Button variant="outline" size="sm" disabled={pageNumber <= 1} onPress={onPrevPage}>
            <Text>Anterior</Text>
          </Button>
          <Text variant="muted" className="text-xs">
            Página {pageNumber} de {totalPages}
          </Text>
          <Button variant="outline" size="sm" disabled={pageNumber >= totalPages} onPress={onNextPage}>
            <Text>Próxima</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
