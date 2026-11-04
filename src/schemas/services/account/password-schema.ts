import { z } from 'zod';

// Same password rule as the registration form (and the API).
export const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres.')
  .regex(/\d/, 'Senha deve ter ao menos 1 número.')
  .regex(/[a-z]/, 'Senha deve ter ao menos 1 letra minúscula.')
  .regex(/[A-Z]/, 'Senha deve ter ao menos 1 letra maiúscula.');
