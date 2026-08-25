import { z } from 'zod';

export const createTransactionRequestSchema = z.object({
  userId: z.string().optional(),
  categoryId: z.number({ message: 'Selecione uma categoria.' }),
  transactionTypeId: z.number({ message: 'Selecione um tipo.' }),
  description: z.string().optional(),
  amount: z.number({ message: 'Valor é obrigatório.' }).positive('Valor deve ser maior que zero.'),
  transactionDate: z.string().min(1, 'Data é obrigatória.'),
});

export type CreateTransactionRequestSchema = z.infer<typeof createTransactionRequestSchema>;
