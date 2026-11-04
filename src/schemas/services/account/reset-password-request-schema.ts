import { z } from 'zod';

import { passwordSchema } from './password-schema';

// The phone comes from the previous step (route param), not from a form field.
export const resetPasswordRequestSchema = z
  .object({
    code: z.string().regex(/^\d{6}$/, 'O código deve ter 6 dígitos.'),
    password: passwordSchema,
    passwordConfirm: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não coincidem.',
    path: ['passwordConfirm'],
  });

export type ResetPasswordRequestSchema = z.infer<typeof resetPasswordRequestSchema>;
