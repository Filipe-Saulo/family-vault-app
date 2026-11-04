import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { hasPermission, hasRole } from '@/lib/permissions';
import type { TransactionsStackRoutes } from '@/navigation/private-routes/transactions-stack/transactionsRoutes';
import { useDeleteTransaction } from '@/services/transaction/delete-transaction-service';
import { useTransactions } from '@/services/transaction/list-transactions-service';
import { useAuthStore } from '@/store/authStore';
import type { Transaction } from '@/types/entities/transaction';

import { TransactionList } from '../components/TransactionList';

const PAGE_SIZE = 20;

export function TransactionsListContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<TransactionsStackRoutes>>();
  const queryClient = useQueryClient();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const roles = useAuthStore((state) => state.roles);
  const permissions = useAuthStore((state) => state.permissions);
  const userId = useAuthStore((state) => state.userId);

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransactions({
      pageSize: PAGE_SIZE,
      userId: userId ?? undefined,
    });
  const {
    mutate: deleteTransaction,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteTransaction();

  const transactions = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const canModify = useCallback(
    (transaction: Transaction) =>
      hasRole(roles, 'Administrator') ||
      hasPermission(permissions, 'ManageTransactions') ||
      transaction.userId === userId,
    [roles, permissions, userId]
  );

  const handleEdit = useCallback(
    (transaction: Transaction) => {
      navigation.navigate('transactionForm', { transaction });
    },
    [navigation]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleDelete = () => {
    if (!transactionToDelete) return;
    deleteTransaction(transactionToDelete.transactionId, {
      onSuccess: () => {
        setTransactionToDelete(null);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      },
    });
  };

  // A failed refetch/next page keeps the loaded pages; only a failed first load blocks the list.
  const hasData = !!data;

  return (
    <>
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        errorMessage={isError && !hasData ? error.message : null}
        onRetry={() => refetch()}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        isFetchingNextPage={isFetchingNextPage}
        nextPageErrorMessage={isError && hasData ? error.message : null}
        onRetryNextPage={() => fetchNextPage()}
        canModify={canModify}
        onEdit={handleEdit}
        onDelete={setTransactionToDelete}
      />
      <ConfirmDialog
        open={transactionToDelete !== null}
        onOpenChange={(open) => !open && setTransactionToDelete(null)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${transactionToDelete?.description ?? ''}"? Essa ação não pode ser desfeita.`}
        isConfirming={isDeleting}
        errorMessage={deleteError?.message}
        onOpen={resetDelete}
        onConfirm={handleDelete}
      />
    </>
  );
}
