import { z } from 'zod';

const PHONE_FORMAT_REGEX = /^[\d+()\-\s]+$/;

export const forgotPasswordRequestSchema = z.object({
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório.')
    .refine(
      (value) => value.length >= 8 && value.length <= 17 && PHONE_FORMAT_REGEX.test(value),
      'Telefone inválido.'
    ),
});

export type ForgotPasswordRequestSchema = z.infer<typeof forgotPasswordRequestSchema>;
