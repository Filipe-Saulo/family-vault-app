import type { Transaction } from '@/types/entities/transaction';

export type TransactionsStackRoutes = {
  transactions: undefined;
  transactionForm: { transaction?: Transaction } | undefined;
};
