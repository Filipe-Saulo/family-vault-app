import { z } from 'zod';

const PHONE_FORMAT_REGEX = /^[\d+()\-\s]+$/;

export const verificationMethodSchema = z.enum(['sms', 'email']);
export type VerificationMethod = z.infer<typeof verificationMethodSchema>;

export const verificationCodeSchema = z.string().regex(/^\d{6}$/, 'O código deve ter 6 dígitos.');

// Validates only the destination picked by `method` (SMS -> phone field, e-mail -> email field).
export function addContactIssues(
  data: { method: VerificationMethod; email?: string; [key: string]: unknown },
  phoneKey: 'phone' | 'phoneNumber',
  ctx: z.RefinementCtx
) {
  if (data.method === 'email') {
    if (!data.email) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'E-mail é obrigatório.' });
    } else if (!z.string().email().safeParse(data.email).success) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'E-mail inválido.' });
    }
    return;
  }
  const phone = data[phoneKey];
  if (typeof phone !== 'string' || !phone) {
    ctx.addIssue({ code: 'custom', path: [phoneKey], message: 'Telefone é obrigatório.' });
  } else if (phone.length < 8 || phone.length > 17 || !PHONE_FORMAT_REGEX.test(phone)) {
    ctx.addIssue({ code: 'custom', path: [phoneKey], message: 'Telefone inválido.' });
  }
}
