import { z } from 'zod';

export const updateUserRequestSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório.').max(30, 'Nome muito longo.'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório.').max(70, 'Sobrenome muito longo.'),
  age: z.number({ message: 'Idade é obrigatória.' }).int().min(0, 'Idade inválida.').max(150, 'Idade inválida.'),
});

export type UpdateUserRequestSchema = z.infer<typeof updateUserRequestSchema>;
