import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { hasPermission, hasRole } from '@/lib/permissions';
import type { TransactionsStackRoutes } from '@/navigation/private-routes/transactions-stack/transactionsRoutes';
import { useDeleteTransaction } from '@/services/transaction/delete-transaction-service';
import { useTransactions } from '@/services/transaction/list-transactions-service';
import { useTransactionTypes } from '@/services/transaction-type/list-transaction-types-service';
import { useAuthStore } from '@/store/authStore';
import type { Transaction } from '@/types/entities/transaction';

import { TransactionList } from '../components/TransactionList';

const PAGE_SIZE = 20;

export function TransactionsListContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<TransactionsStackRoutes>>();
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const roles = useAuthStore((state) => state.roles);
  const permissions = useAuthStore((state) => state.permissions);
  const userId = useAuthStore((state) => state.userId);

  const { data } = useTransactions({ pageNumber, pageSize: PAGE_SIZE, userId: userId ?? undefined });
  const { data: transactionTypes } = useTransactionTypes(true);
  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;

  const canModify = (transaction: Transaction) =>
    hasRole(roles, 'Administrator') ||
    hasPermission(permissions, 'ManageTransactions') ||
    transaction.userId === userId;

  const handleEdit = (transaction: Transaction) => {
    navigation.navigate('transactionForm', { transaction });
  };

  const handleDelete = (transactionId: number) => {
    deleteTransaction(transactionId, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    });
  };

  return (
    <TransactionList
      transactions={data?.items ?? []}
      transactionTypes={transactionTypes ?? []}
      canModify={canModify}
      isDeleting={isDeleting}
      onEdit={handleEdit}
      onDelete={handleDelete}
      pageNumber={pageNumber}
      totalPages={totalPages}
      onPrevPage={() => setPageNumber((page) => Math.max(1, page - 1))}
      onNextPage={() => setPageNumber((page) => Math.min(totalPages, page + 1))}
    />
  );
}
