import { z } from 'zod';

export const updateUserRequestSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório.'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório.'),
  age: z.number({ message: 'Idade é obrigatória.' }).int().positive('Idade inválida.'),
});

export type UpdateUserRequestSchema = z.infer<typeof updateUserRequestSchema>;
