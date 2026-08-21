export interface Transaction {
  transactionId: number;
  description: string;
  amount: number;
  transactionDate: string;
  userId: string;
  category: {
    categoryId: number;
    description: string;
    purpose: {
      categoryPurposeId: number;
      name: string;
    };
  };
  transactionType: {
    transactionTypeId: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string | null;
}
