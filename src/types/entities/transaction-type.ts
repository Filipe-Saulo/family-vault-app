export interface TransactionType {
  transactionTypeId: number;
  code: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}
