import { z } from 'zod';

import { confirmChargeRequestSchema } from './confirm-charge-request-schema';

export const manualChargeRequestSchema = confirmChargeRequestSchema.extend({
  issuer: z.string().optional(),
});

export type ManualChargeRequestSchema = z.infer<typeof manualChargeRequestSchema>;
