import { z } from 'zod';

export const chargePasswordRequestSchema = z.object({
  password: z
    .string({ message: 'Informe a senha.' })
    .min(1, 'Informe a senha.')
    .max(100, 'A senha deve ter no máximo 100 caracteres.'),
  rememberForSender: z.boolean(),
});

export type ChargePasswordRequestSchema = z.infer<typeof chargePasswordRequestSchema>;
