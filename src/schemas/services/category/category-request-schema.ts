import { z } from 'zod';

export const categoryRequestSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.'),
  categoryPurposeId: z.number({ message: 'Selecione uma finalidade.' }),
});

export type CategoryRequestSchema = z.infer<typeof categoryRequestSchema>;
