import { z } from 'zod';

import { passwordSchema } from './password-schema';

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória.'),
    password: passwordSchema,
    passwordConfirm: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não coincidem.',
    path: ['passwordConfirm'],
  });

export type ChangePasswordRequestSchema = z.infer<typeof changePasswordRequestSchema>;
