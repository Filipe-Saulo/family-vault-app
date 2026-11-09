import { z } from 'zod';

import { verificationCodeSchema } from './contact-issues';
import { passwordSchema } from './password-schema';

// The phone/e-mail comes from the previous step (route param), not from a form field.
export const resetPasswordRequestSchema = z
  .object({
    code: verificationCodeSchema,
    password: passwordSchema,
    passwordConfirm: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não coincidem.',
    path: ['passwordConfirm'],
  });

export type ResetPasswordRequestSchema = z.infer<typeof resetPasswordRequestSchema>;
