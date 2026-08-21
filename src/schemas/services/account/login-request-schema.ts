import { z } from 'zod';

export const loginRequestSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(1, 'Senha é obrigatória.'),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      if (!data.email) {
        ctx.addIssue({ code: 'custom', path: ['email'], message: 'E-mail é obrigatório.' });
      } else if (!z.string().email().safeParse(data.email).success) {
        ctx.addIssue({ code: 'custom', path: ['email'], message: 'E-mail inválido.' });
      }
    } else if (!data.phone) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Telefone é obrigatório.' });
    }
  });

export type LoginRequestSchema = z.infer<typeof loginRequestSchema>;
