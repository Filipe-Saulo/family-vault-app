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
      code: number;
    };
  };
  transactionType: {
    transactionTypeId: number;
    name: string;
    code: number;
  };
  createdAt: string;
  updatedAt: string | null;
}
