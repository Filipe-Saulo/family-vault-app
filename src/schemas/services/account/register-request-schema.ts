import { z } from 'zod';

const PHONE_FORMAT_REGEX = /^[\d+()\-\s]+$/;

export const registerRequestSchema = z
  .object({
    firstName: z.string().min(1, 'Nome é obrigatório.').max(30, 'Nome muito longo.'),
    lastName: z.string().min(1, 'Sobrenome é obrigatório.').max(70, 'Sobrenome muito longo.'),
    age: z.number({ message: 'Idade é obrigatória.' }).int().positive('Idade inválida.'),
    phoneNumber: z
      .string()
      .min(1, 'Telefone é obrigatório.')
      .refine(
        (value) => value.length >= 8 && value.length <= 17 && PHONE_FORMAT_REGEX.test(value),
        'Telefone inválido.'
      ),
    password: z
      .string()
      .min(6, 'Senha deve ter no mínimo 6 caracteres.')
      .regex(/\d/, 'Senha deve ter ao menos 1 número.')
      .regex(/[a-z]/, 'Senha deve ter ao menos 1 letra minúscula.'),
    passwordConfirm: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não coincidem.',
    path: ['passwordConfirm'],
  });

export type RegisterRequestSchema = z.infer<typeof registerRequestSchema>;
