import { z } from 'zod';

import { addContactIssues, verificationCodeSchema, verificationMethodSchema } from './contact-issues';
import { passwordSchema } from './password-schema';

export const registerRequestSchema = z
  .object({
    firstName: z.string().min(1, 'Nome é obrigatório.').max(30, 'Nome muito longo.'),
    lastName: z.string().min(1, 'Sobrenome é obrigatório.').max(70, 'Sobrenome muito longo.'),
    age: z.number({ message: 'Idade é obrigatória.' }).int().min(0, 'Idade inválida.').max(150, 'Idade inválida.'),
    method: verificationMethodSchema,
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    password: passwordSchema,
    passwordConfirm: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .superRefine((data, ctx) => {
    addContactIssues(data, 'phoneNumber', ctx);
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({ code: 'custom', path: ['passwordConfirm'], message: 'As senhas não coincidem.' });
    }
  });

export type RegisterRequestSchema = z.infer<typeof registerRequestSchema>;

// Second step: the code typed on the verification screen.
export const registerCodeSchema = z.object({ code: verificationCodeSchema });
export type RegisterCodeSchema = z.infer<typeof registerCodeSchema>;
