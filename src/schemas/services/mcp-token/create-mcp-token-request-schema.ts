import { z } from 'zod';

export const createMcpTokenRequestSchema = z.object({
  name: z.string().trim().min(1, 'Dê um nome ao token.').max(100, 'Nome muito longo.'),
  expiresInDays: z.union([z.literal(30), z.literal(90), z.literal(365)]),
});

export type CreateMcpTokenRequestSchema = z.infer<typeof createMcpTokenRequestSchema>;
