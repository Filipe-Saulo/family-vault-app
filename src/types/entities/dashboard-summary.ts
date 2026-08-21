export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: Array<{
    categoryId: number;
    categoryDescription: string;
    transactionTypeId: number;
    transactionTypeCode: number;
    transactionTypeName: string;
    total: number;
  }>;
}
