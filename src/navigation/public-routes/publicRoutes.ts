import type { RegisterRequestSchema } from '@/schemas/services/account/register-request-schema';

export type PublicRoutes = {
  login: undefined;
  register: undefined;
  // Form data travels in memory only (never persisted); sentAt is when the code was requested.
  registerCode: { form: RegisterRequestSchema; sentAt: number };
  forgotPassword: undefined;
  resetPassword: { phone?: string; email?: string; sentAt: number };
};
