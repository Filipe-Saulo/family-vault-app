import { z } from 'zod';

export const confirmChargeRequestSchema = z.object({
  description: z
    .string({ message: 'A descrição é obrigatória.' })
    .trim()
    .min(1, 'A descrição é obrigatória.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  amount: z.number({ message: 'Valor é obrigatório.' }).positive('Valor deve ser maior que zero.'),
  dueDate: z.string({ message: 'O vencimento é obrigatório.' }).min(1, 'O vencimento é obrigatório.'),
  categoryId: z.number({ message: 'Selecione uma categoria.' }),
});

export type ConfirmChargeRequestSchema = z.infer<typeof confirmChargeRequestSchema>;
