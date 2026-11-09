import { z } from 'zod';

import { addContactIssues, verificationMethodSchema } from './contact-issues';

export const forgotPasswordRequestSchema = z
  .object({
    method: verificationMethodSchema,
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => addContactIssues(data, 'phone', ctx));

export type ForgotPasswordRequestSchema = z.infer<typeof forgotPasswordRequestSchema>;
