import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório.').email('E-mail inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

export type LoginRequestSchema = z.infer<typeof loginRequestSchema>;
