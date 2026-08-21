// Shared by Category.Purpose.Code and TransactionType.Code - the API requires
// a transaction's type code to match its category's purpose code.
export const PurposeCode = {
  Expense: 1,
  Income: 2,
} as const;
