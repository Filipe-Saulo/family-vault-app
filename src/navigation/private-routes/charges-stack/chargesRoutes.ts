import type { Charge } from '@/types/entities/charge';

export type ChargesStackRoutes = {
  charges: undefined;
  chargeReview: { charge: Charge };
};
